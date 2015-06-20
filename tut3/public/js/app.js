angular.module('routerApp', [])

// create the controllers
// this will be the controller for the entire site
.controller('mainController', function() {
	
	var vm = this;
	
	// create a bigMessage variable to display in our view
	vm.bigMessage = "A smooth sea never made a skilled sailor";	
})

// home page specific controller
.controller('homeController', function(){
	var vm = this;
	
	vm.message = "this is the homepage!";
})

// about page controller
.controller('aboutController', function(){
	var vm = this;
	
	vm.message = 'Look! I am an about me page';
})

// contact us
.controller('contactController', function(){
	
	var vm = this;
	
	vm.message = 'Look I am a contact page!';
});