var hd = new Hoodie();

$(document).ready(function (){
	ideas_model();
	newidea_action();
});

function ideas_model(){

	var store = hd.store('idea');
	var collection = [];

	store.findAll('idea').then(function(ideas) {
		collection = ideas.sort(sortByTitle);
		render();
	});

	store.on('add', function (idea){
		collection.push(idea);
		collection = collection.sort(sortByTitle);
		render();
	});

	store.on('update', function (idea){

		collection = collection
			.map(function (cachedIdea){ return cachedIdea.id === idea.id ? idea : cachedIdea; })
			.sort(sortByTitle);

		render();
	});

	store.on('remove', function (idea){
		collection = collection.filter(function (cachedIdea){ return cachedIdea.id !== idea.id; });
		render();
	});

	function render(){
		var component = collection.map(function (item){ return '<li class="idea">' + item.title + '</li>'; }).join('');
		$('#ideas-list').html(component);
	}

	function sortByTitle(a, b){
		return a.title > b.title;
	}

}

function newidea_action(){

	var textarea = $('textarea[name="newidea"]');

	register_idea_prompt_onclick();
	register_textarea_enter();

	function register_idea_prompt_onclick(){
		$('[data-action="prompt-for-idea"]').click(function (){ textarea.show(); });
	}

	function register_textarea_enter(){

		textarea.on('keypress', function(event) {
			if (event.keyCode === 13 && event.target.value.length) {
				hd.store.add('idea', { title: event.target.value });
				event.target.value = '';
				textarea.hide();
			}
		});

	}

}