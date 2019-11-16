# Log Purity

**Warning**: The following is considered ivory tower territory.

Many Functional programmers who work on feature teams (shipping software non-developer users use) believe that purity of logging is not worth it. They have a pragmatic view that side effects I outline here are not a big deal, and their ease of use and debugging & monitoring gains far outweigh the risk of unknown side effects.

That said, this book is about real world programming, and while the real world requires you as a programmer to make tough calls for the sake of pragmatism, like [Patton](https://en.wikipedia.org/wiki/George_S._Patton) said:

> Take calculated risks. That is quite different from being rash.

You need to be aware of the potential side effects that loggers can have before you write off their side effects as nothing to worry about.

## Logging Purity & Side Effects

In production applications, especially the back-end, you'll use more sophisticated loggers. Logging has side effects. For example, `console.log` is noop in that it doesn't return a value:

```javascript
const result = console.log("yo")
console.log(result) // undefined
```

Now, while it doesn't technically have a side effect in JavaScript, it DOES have a side effect in the system it's running on. The console will output to standard out (stdout). This is a stream of text that the operating system, typically `syslog` on Unix/Linux based systems will manage and aggregate. Effectively your `console.log` is pushing text into this global text area. This is compounded when using Docker Containers or Serverless when you have distributed systems.

If you are running Docker containers on Amazon's [Elastic Container Service](https://aws.amazon.com/ecs/) (ECS), for example, you my have 3 of the same containers running at the same time, whether for scaling purposes or for each availability zone or both. When a `console.log` is run, all 3 are outputting to Docker logs, and in turn those are pushed to Amazon's [CloudWatch](https://aws.amazon.com/cloudwatch/) or something like [Logstash](https://www.elastic.co/products/logstash). Same thing for running multiple [Lambda](https://aws.amazon.com/lambda/) functions at the same time; same code, but different instances logging to the same place.

You or your Ops team may have alarms setup to use these logs to help monitor the health of your infrastructure. Some of these alarms may be automated to destroy unhealthy infrastructure, and create new servers, send monitoring emails, send text messages to your team when infrastructure appears unhealthy, etc.

`console.log`: Destroying and recreating infrastructure as well as sending emails to Ops and text messages to your boss.

As you can see, those are some huge side effects from a log.

## Logging Configurations

Loggers often have a variety of various configurations and outputs as well. For example, many log parsers expect JSON, and each log message in a single line. Those kind of logs are not really useable for local development so you'll turn developer friendly formatting on, like `prettyPrint` for [pino](https://github.com/pinojs/pino):

```javascript
const pino = require('pino')
const log = pino({
  prettyPrint: true
})
```

Traditionally, you'd use something like [config](https://github.com/lorenwest/node-config) to determine if you're in a production environment.

```javascript
...
const config = require('config')
const log = pino({
  prettyPrint: config.get('env') === 'prod'
})
```

Flipping a `Boolean` switch is a mutation with side effects. A more pure way is to create 2 different loggers; one for development/qa, and one for production.

```javascript
const getDevLogger = () => pino({ prettyPrint: true })
const getProdLogger = () => pino()
```

## Streams and Exponential Side Effects

Many loggers do more than just shuttle text. Some will take your `thing.logThis('message')` and send that same messages to multiple places in multiple formats. For example, the [Bunyan logger](https://github.com/trentm/node-bunyan) allows you to create streams in the construction of the logger:

```javascript
const log = bunyan.createLogger({
    name: 'myapp',
    streams: [
    {
        level: 'info',
        stream: process.stdout
    },
    {
        level: 'error',
        path: '/var/tmp/myapp-error.log'
    },
    {
        level: 'warn',
        stream: kafkaStream
    }
  ]
})
```

Now whenever we do a `log.warn('oh n0es')`, it'll go to standard out, to a local text file, and to a [Kafka](https://kafka.apache.org/) stream for auditing purposes. As above, these may change based on environment. These are also most likely going to have side effects, specifically writing to a file and sending a socket message with acknowledgement on a Kafka stream.

## Minimum Logging Side Effects

How do you use those logger instances, though? In most dynamic languages, you can use those as closures or globals and even the Clojure developers consider that acceptable. However, you've seen the side effects loggers can have: infrastructure changes, broken log/monitoring systems, file writing and sockets, oh my. I deployed our API code in prod with Pino's `prettyPrint` set to true, and it basically made the logs in ELK impossible to read. This meant if we had a production issue, I'd have no idea why by using the logs and would have to look elsewhere. Huge deal.

If you follow the Kent Beck model of TDD, you're probably also fine with these side effects being triggered in your unit tests instead of stubbing/mocking them. If, on the other hand you're still exploring an API's implementation details, learning, or tracking down a strange bug in your audit system, bringing as much purity to your logging layer can really put a capstone on the purity of your code base.

It's also a royal pain in the neck, more so than [total functions](part7/README.md). As soon as the implementation of a child function changes, you'll need to ensure you include a logger for it in the function parameters.

For example, here is a function that gets a user's email address and includes the logger as the first parameter:

```javascript
const getUserInformation = logger => request => userID =>
    new Promise((success, failure) => {
        logger.log(`Getting user information, userID: ${userID}`)
        request.get(`/user/${userID}`, (err, res, data) => {
            if(err) {
                logger.error(err)
                return failure(err)
            }
            logger.log(`Get user information result: ${data}`)
            success(data)
        })
    })
```

Here is a `sendEmail` function that utilizes it:

```javascript
const logger = getProdLogger()

const sendEmail = request => userID => {
    logger.log(`sendEmail for userID: ${userID}`)
    getUserInformation(logger, request, userID)
    .then(user => sendActualEmail(user.email)
}
```

Notice the `getUserInformation` function to be pure takes in 3 parameters: the logger, request, and the userID. However, the `sendEmail` takes a pragmatic approach and uses the `logger` as a closure referenced variable... effectively having side effects. If you're being a purist, you have to change the `sendEmail` function signature to include the logger:

```javascript
const sendEmail = logger => request => userID => ...
```

Hopefully if it's a public method, you've only exposed the partial application to prevent the changing of a public API:

```javascript
module.exports = {
    sendEmail: sendEmail(require('request'))
}
```

Changing it too:

```javascript
module.exports = {
    sendEmail: sendEmail(logger, require('request'))
}
```

## Conclusions

From my experience in the industry and talking to a variety of Haskell, Elm, PureScript, and Clojure programmers, with the exclusion of Haskell, most take a pragmatic approach to logging:

- they don't unit test their production logger, they just use it
- they don't mind it being a global/closure referenced variable
- they don't mind it having side effects even in their unit tests

Just be aware OF those side effects to minimize the bad parts where you can, if they're applicable to you.
