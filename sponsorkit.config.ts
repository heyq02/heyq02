import { defineConfig, tierPresets } from 'sponsorkit'

export default defineConfig({
  // IncludePrivate: true,
  tiers: [
    {
      title: 'Past Sponsors',
      monthlyDollars: -1,
      preset: tierPresets.xs
    },
    {
      title: 'Backers'
      // To replace the entire tier rendering
      // Compose: (composer, tierSponsors, config) => {
      //   Composer.addRaw(
      //     '<-- custom svg -->',
      //   )
      // },
    },
    {
      title: 'Sponsors',
      monthlyDollars: 10,
      preset: tierPresets.medium,
      // To insert custom elements after the tier block
      composeAfter: (composer, _tierSponsors, _config) => {
        composer.addSpan(10)
      }
    },
    {
      title: 'Silver Sponsors',
      monthlyDollars: 50,
      preset: tierPresets.large
    },
    {
      title: 'Gold Sponsors',
      monthlyDollars: 100,
      preset: tierPresets.xl
    }
  ],

  // Replace links and avatars
  // ReplaceLinks: {
  //   'https://github.com/antfu': 'https://antfu.me',
  // },
  // ReplaceAvatars: {
  //   ...
  // },

  // Automatically Merge sponsors from different platforms
  sponsorsAutoMerge: true,

  // Manually merge sponsors from different platforms
  // MergeSponsors: [
  //   [
  //     { login: 'patak-dev', provider: 'github' },
  //     { login: 'patak', provider: 'opencollective' },
  //   ],
  // ],

  // Run multiple renders with different configurations
  renders: [
    {
      name: 'sponsors',
      width: 800,
      formats: ['svg', 'png']
    },
    {
      name: 'sponsors-wide',
      width: 1000,
      formats: ['svg']
    },
    {
      renderer: 'circles',
      name: 'sponsors-circles',
      width: 1000,
      includePastSponsors: true
    }
  ]
})
