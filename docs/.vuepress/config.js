// .vuepress/config.js
module.exports = {
    base: '/real-world-functional-programming-book/',
    themeConfig: {
      displayAllHeaders: false,
      sidebarDepth: 3,
      sidebar: [
        {
          title: 'Inroduction',   // required
          path: '/',      // optional, which should be a absolute path.
          sidebarDepth: 3,    // optional, defaults to 1
          children: []
        },
        {
          title: 'Part 1: Pure Functions',   // required
          path: '/part1/',      // optional, which should be a absolute path.
          sidebarDepth: 3,    // optional, defaults to 1
          children: [
            '/part1/input_output_side_effects',
            '/part1/var_and_let',
            '/part1/using_vs_enforcing_immutability',
            '/part1/spot_the_impurities',
            '/part1/error_quest',
            '/part1/not_allowed',
            '/part1/practice_purity',
            '/part1/practice_stubs'
          ]
        },
        {
          title: 'Part 2: Getting and Setting Data',
          path: '/part2/',
          sidebarDepth: 3,
          children: [
            '/part2/trouble_with_dots',
            '/part2/trouble_with_array_access',
            '/part2/get',
            '/part2/set',
            '/part2/lenses'
          ]
        },
        {
          title: 'Part 3: List Comprehensions',
          path: '/part3/',
          sidebarDepth: 3,
          children: [
            '/part3/map',
            '/part3/filter',
            '/part3/reduce',
            '/part3/every',
            '/part3/some'
          ]
        },
        {
          title: 'Part 4: Curry and Partial Applications',
          path: '/part4/',
          sidebarDepth: 3,
          children: [
            '/part4/curry',
            '/part4/parameter_order',
            '/part4/partial_application',
            '/part4/closures_and_immutability',
            '/part4/arity',
            '/part4/styles_of_curry',
            '/part4/lodash_fp'
          ]
        },
        {
          title: 'Part 5: Composition',
          path: '/part5/',
          sidebarDepth: 3,
          children: [
            '/part5/passing_functions_to_functions',
            '/part5/composing_functions',
            '/part5/tacit_programming'
          ]
        },
        {
          title: 'Part 6: Algebraic Data Types',
          path: '/part6/',
          sidebarDepth: 3,
          children: [
            '/part6/maybe',
            '/part6/validation',
            '/part6/result',
            '/part6/union',
          ]
        },
        {
          title: 'Part 7: Optics',
          path: '/part7/',
          sidebarDepth: 3,
          children: [
            '/part7/isomorphisms',
            '/part7/prisms',
            '/part7/composing_lenses',
            '/part7/custom_lens'
          ]
        },
        {
          title: 'Part 8: Debugging',
          path: '/part8/',
          sidebarDepth: 3,
          children: [
            '/part8/debugging',
            '/part8/log_purity',
          ]
        },
        {
          title: 'Part 9: Testing',
          path: '/part9/',
          sidebarDepth: 3,
          children: [
            '/part9/testing.md',
            '/part9/stubs_and_mocks',
          ]
        },
      ]
    }
  }
