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
            exp: 0,
            inc: 0
        }
    }

    return {
        addItem: function(type, description, amount) {

            var newItem, ID;

            // Initialize ID count
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Create item depending on type
            if (type === 'exp') {
                newItem = new Expense(ID, description, amount);
            } else if (type === 'inc'){
                newItem = new Income(ID, description, amount);
            }

            // Finally push item to respective array
            data.allItems[type].push(newItem);
            return newItem;

        },
        test: function() {
            console.log(data);
        }
    };

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

        var input, newItem;

        //1. Get input data
        input = UICtrl.getInput();

        //2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.amount);

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
