var database = {};

function loadDatabase() {
  recipes = {"test":{ingredients:[{item:"foo", count:2, tools: []},{item:"bar", count:1, tools:[]}]},
             "foo":{ingredients:[{item:"bar", count: 3, tools: []}]},
             "bar":{ingredients:[]}};
  populateRecipes(recipes);
  return recipes;
}

function populateRecipes(recipes) {
  $.each(recipes, function(name, recipeData) {
    recipeData.name = name;
    var resolvedIngredients = $.map(recipeData.ingredients, function(ingredient, index) {
      ingredient.item = recipes[ingredient.item];
      return ingredient;
    });
    recipeData.ingredients = resolvedIngredients;
  });
}

function addIngredientItem(list, ingredient) {
  var item = $('<li class="sub_item"></li>');
  item.append($('<span class="item_name">').append(ingredient.item.name));
  var subItems = $('<div>');

  if (ingredient.item.ingredients.length) {
    subItems.append('<a href="" class="open_sub_item">+</a>')
  }
  subItems.append('<ul class="sub_item_list"></ul>');
  item.append(subItems);
  list.append(item);
}

function addIngredients(list, recipe) {
  $.each(recipe.ingredients, function(index, ingredient) {
    addIngredientItem(list, ingredient);
  });
}

function setRecipe(recipe) {
  $('input#recipe_name').val(recipe.name);
  var list = $('ul#ingredient_list');
  addIngredients(list, recipe);
 }

jQuery(function() {

  $("body").on("input", "input#recipe_suggest", function() {
    var text = $("input#recipe_suggest").val();
    var recipe = database[text];
    if (recipe) {
      setRecipe(recipe);
    }
  });

  $("body").on("click", "a.open_sub_item", function(event) {
    event.preventDefault();
    var self = $(this);
    var li = $(this).closest('.sub_item');
    var name = li.children('.item_name').text();;
    var recipe = database[name]
    var list = self.siblings(".sub_item_list");
    addIngredients(list, recipe);
  });


  database = loadDatabase();
  var datalist = $('datalist#recipe_suggest_data');
  console.log(database);
  $.each(database, function(name, recipeData) {
    datalist.append($('<option>', {value: name}));
  });

});
