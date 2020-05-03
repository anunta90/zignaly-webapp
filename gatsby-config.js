module.exports = {
    siteMetadata: {
        title: `Zignaly Gatsby Starter`,
        description: `Zignaly the copy-trader platform.`,
    },
    plugins: [
        `gatsby-plugin-react-helmet`,
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `images`,
                path: `${__dirname}/src/images`,
            },
        },
        `gatsby-transformer-sharp`,
        `gatsby-plugin-sharp`,
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: `gatsby-starter-default`,
                short_name: `Zignaly`,
                start_url: `/`,
                background_color: `#663399`,
                theme_color: `#663399`,
                display: `minimal-ui`,
                // This path is relative to the root of the site.
                icon: `src/images/gatsby-icon.png`,
            },
        },
    ]
}
