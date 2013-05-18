var database = {};

function loadDatabase() {
  recipes = {"a":{ingredients:[{item:"b", count: 2, tools: []},{item:"c", count:1, tools:[]}]},
             "b":{ingredients:[{item:"c", count: 3, tools: []}, {item:"d", count: 1, tools: []}]},
             "c":{ingredients:[{item:"d", count: 5, tools: []}]},
             "d":{ingredients:[]}
            };
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
  item.append('<a href="#" class="item_name">'+ingredient.item.name+'</a>');

  if (ingredient.item.ingredients.length) {
    item.append($('<a href="#" class="toggle_sub_item">+</a>'));
  }

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
  list.empty();
  addIngredients(list, recipe);
  $('ul#ingredient_list').children('li.sub_item').addClass('selected');
  recalculateCosts();
 }

function recalculateCosts() {
  var list = $('table#costs');
  list.children('tr');
  list.remove();
  var selectedItems = $('ul#ingredient_list li.sub_item.selected');

  console.log(list);
}

jQuery(function() {

  $("body").on("input", "input#recipe_suggest", function() {
    var text = $("input#recipe_suggest").val();
    var recipe = database[text];
    if (recipe) {
      setRecipe(recipe);
    }
  });

  $("body").on("click", "a.toggle_sub_item", function(event) {
    event.preventDefault();
    var self = $(this);
    var subList = self.siblings('.sub_item_list');
    if (subList.length) {
    } else {
      var list = $('<ul class="sub_item_list"></ul>');
      var li = $(this).closest('.sub_item');
      li.append(list);
      var name = li.children('.item_name').text();
      var recipe = database[name]
      addIngredients(list, recipe);
    }
  });

  $("body").on("click", "a.item_name", function() {
    var thisLi = $(this).closest('li.sub_item');
    var selected_sub_items = $(this).siblings('ul.sub_item_list').find($('li.sub_item.selected'));
    if (selected_sub_items.length) {
      selected_sub_items.removeClass('selected');
      thisLi.addClass('selected');
    } else {
      var selected_parent_item = $(this).closest('.sub_item').closest('.sub_item.selected');
      selected_parent_item.removeClass('selected');
      thisLi.addClass('selected');
      var children = selected_parent_item.children('ul.sub_item_list').children('li.sub_item').not('.selected');
      children.each(function() {
        if (!$(this).find('li.sub_item.selected').length) {
          $(this).addClass('selected');
        }
      });
    }
    recalculateCosts();
  });

  database = loadDatabase();
  var datalist = $('datalist#recipe_suggest_data');
  console.log(database);
  $.each(database, function(name, recipeData) {
    datalist.append($('<option>', {value: name}));
  });

});
