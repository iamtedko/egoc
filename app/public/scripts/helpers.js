var btcHelper = {
	getAddress: function() {
	    var key = Bitcoin.ECKey.makeRandom()
	    var address = key.pub.getAddress().toString()
		return address
	}
}

