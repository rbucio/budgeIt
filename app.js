// BUDGET CONTROLLER
var budgetController = (function() {



})();


// UI CONTROLLER
var UIController = (function() {



})();


// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

    var ctrlAddItem = function() {

        //1. Get input data

        //2. Add the item to the budget controller

        //3. Add the item to the UI

        //4. Calculate the budget

        //5. Display the budget on the UI
        console.log('It works');
    }

    document.querySelector('#add-button').addEventListener('click', ctrlAddItem);

    window.addEventListener('keypress', function(e) {

        if (e.keyCode === 13 || e.which === 13) {
            ctrlAddItem();
        }

    });



})( budgetController, UIController);
