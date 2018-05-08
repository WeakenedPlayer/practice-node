const path = require('path');
const webpack = require( 'webpack' );

module.exports = {
    mode: 'development',
    entry: './bin/www.ts',
    target: 'node',
    node: {
          __dirname: false,
          __filename: false,
    },
    output : {
        path: `${__dirname}/../dist/server`,
        filename: '[name].js'
    },
    devtool: 'source-map',
    resolve: {
    	mainFields: ["main", "module"],
        extensions:['.ts', '.webpack.js', '.web.js', '.js', '.json' ]
    },
    module : {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'ts-loader',
                    }
                ]
              }
        ],
    },
    externals: [],
    plugins:[],
};
