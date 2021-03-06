// name our angular app
angular.module('firstApp', [])

.controller('mainController', function() {
	
	// bind this to vm (view-model)
	var vm = this;
	
	//define variables and objects on this
	// this lets them be available to our views
	
	//define a basic variable
	vm.message = 'Hey There! Come and see how good i look!';
	
	//define a list of items 
	vm.computers = [
		{ name: 'Mac Book Pro', color: 'Silver', nerdness: 7},
		{ name: 'Surface Pro 3', color: 'Black', nerdness: 6},
		{ name: 'chromebook', color: 'Gray', nerdness: 5}
	]
	//information that comes from our form
	vm.computerData = {};
	
	vm.addComputer = function() {
		
		// add a computer to the list
		vm.computers.push({
			name: vm.computerData.name,
			color: vm.computerData.color,
			nerdness: vm.computerData.nerdness
		});
		
		// after a computer has been added clear the form
		vm.computerData = {};
	}
});