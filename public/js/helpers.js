window.helpers = (function() {
	// BLEEF FUNCTION
	function newDefinition(attrs = {}) {
		const definition = {
			word: attrs.word,
			definition: attrs.definition,
			player: attrs.player,
			id: uuid.v4() // eslint-disable-line no-undef
		};

		return definition;
	}

	function findById(array, id, cb) {
		array.forEach(el => {
			if (el.id === id) {
				cb(el);
				return;
			}
		});
	}

	return {
		findById,
		newDefinition
	};
})();
