// BUDGET CONTROLLER
var budgetController = (function() {

    var Expense = function(id, description, amount) {
        this.id = id;
        this.description = description;
        this.amount = amount;
    };

    var Income = function(id, description, amount) {
        this.id = id;
        this.description = description;
        this.amount = amount;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        total: {
            exp: [],
            inc: []
        }
    }

})();


// UI CONTROLLER
var UIController = (function() {

    var DOMstrings = {
        inputType: '#type',
        inputDescription: '#description',
        inputAmount: '#amount',
        inputButton: '#add-button'
    }

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                amount: document.querySelector(DOMstrings.inputAmount).value
            }
        },
        getDOMstrings: function() {
            return DOMstrings;
        }
    }

})();


// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

    var setUpEventListeners = function() {

        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

        window.addEventListener('keypress', function(e) {

            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            }

        });

    };

    var ctrlAddItem = function() {

        //1. Get input data
        var input = UICtrl.getInput();

        //2. Add the item to the budget controller

        //3. Add the item to the UI

        //4. Calculate the budget

        //5. Display the budget on the UI
        console.log(input);
    };

    return {
        init: function() {
            setUpEventListeners();
        }
    };

})( budgetController, UIController);

controller.init();
