var Stock = require('model/Stock');
var ps = require('service/PreferenceService');

function SettingsView() {
	var self = Ti.UI.createView({
		backgroundColor: '#006600',
		width: '100%',
		height: '100%'
	});
	
	self.add(Ti.UI.createLabel({
		left: 10,
		top: 30,
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE,
		text: 'Your money objective ($):',
		font: {
			fontSize: '14sp',
			fontWeight: 'bold'
		}
	}));
	
	var txtObjective = Ti.UI.createTextField({
		right: 15,
		top: 15,
		width: 190,
		height: Ti.UI.SIZE,
		backgroundColor: '#ffffff',
		hintText: 'Amount',
		keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD,
		value: ps.getObjective()
	});

	self.add(txtObjective);

	self.add(Ti.UI.createLabel({
		left: 10,
		top: 100,
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE,
		text: 'Symbol:',
		font: {
			fontSize: '14sp',
			fontWeight: 'bold'
		}
	}));
	
	var txtSymbol = Ti.UI.createTextField({
		left: 97,
		top: 85,
		width: 100,
		height: Ti.UI.SIZE,
		backgroundColor: '#ffffff'
	});
	
	self.add(txtSymbol);
	
	self.add(Ti.UI.createLabel({
		left: 210,
		top: 100,
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE,
		text: 'Quantity:',
		font: {
			fontSize: '14sp',
			fontWeight: 'bold'
		}
	}));

	var txtQuantity = Ti.UI.createTextField({
		left: 310,
		top: 85,
		width: 75,
		height: Ti.UI.SIZE,
		keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD,
		backgroundColor: '#ffffff'
	});
	
	self.add(txtQuantity);
	
	var btnAddStock = Ti.UI.createButton({
		right: 15,
		top: 85,
		width: 75,
		title: 'Add'
	});
	
	self.add(btnAddStock);
	
	var stockList = Ti.UI.createTableView({
		left: 0,
		top: 170,
		width: Ti.UI.FILL,
		height: '60%'
	}); 
	
	self.add(stockList);
	
	var btnSave = Ti.UI.createButton({
		bottom: 10,
		title: 'Save Settings'
	});

	self.add(btnSave);
	
	btnAddStock.addEventListener('click', function() {
		var stock = new Stock(txtSymbol.value.toUpperCase(), txtQuantity.value);
		
		Ti.API.info(JSON.stringify(stock));
		
		addCustomRow(stockList, stock);
	});
	
	btnSave.addEventListener('click', function() {
		var stocks = [];
		
		ps.saveObjective(parseInt(txtObjective.value) || 0);
		
		var section = stockList.data[0];
		
		for (var i = 0; i < section.rowCount; i++) {
			var row = section.rows[i];
			
			stocks.push(row.stock);
		}
		
		ps.saveStocks(stocks);	    
		
		self.fireEvent('settings:close');
	});
	
	var stocks = ps.getStocks();
	
	for (var i=0; i < stocks.length; i++) {
		addCustomRow(stockList, stocks[i]);
	}
	
	return self;
}

function addCustomRow(table, stock) {
	var row = Ti.UI.createTableViewRow();
	
	row.add(Ti.UI.createLabel({
		text: stock.symbol,
		left: 5, 
		top: 1,
		font: {
			fontSize: '15sp',
			fontWeight: 'bold'
		}
	}));
	
	row.add(Ti.UI.createLabel({
		text: 'Latest Price: ' + stock.price + '$',
		right: 5, 
		top: 1,
		font: {
			fontSize: '9sp',
		}
	}));
	
	row.add(Ti.UI.createLabel({
		text: 'x' + stock.quantity,
		right: 5, 
		top: 20,
		font: {
			fontSize: '8sp',
			fontStyle: 'italic'
		}
	}));
	
	// Used to keep reference to the ioriginal object
	// Used when saving Portfolio
	row.stock = stock;
	
	table.appendRow(row);
}

module.exports = SettingsView;