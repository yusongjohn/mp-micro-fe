module.exports = {
    getSubPkgsFromJson: function (json) {
        return json['subPackages'] || json['subpackages'] || []
    }
}