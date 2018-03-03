module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js'
  },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
};
