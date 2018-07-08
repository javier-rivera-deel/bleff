/* eslint-disable no-console */
/* eslint-disable no-undef */
window.client = (function() {
	// NEW API
	function getDefinitions(success) {
		return fetch("/api/words", {
			headers: {
				Accept: "application/json"
			}
		})
			.then(checkStatus)
			.then(parseJSON)
			.then(success);
	}

	function getStat(success) {
		return fetch("/api/game", {
			headers: {
				Accept: "application/json"
			}
		})
			.then(checkStatus)
			.then(parseJSON)
			.then(success);
	}

	function createDefinition(data) {
		return fetch("/api/words", {
			method: "post",
			body: JSON.stringify(data),
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			}
		}).then(checkStatus);
	}

	function submitStat(data) {
		return fetch("/api/game", {
			method: "post",
			body: JSON.stringify(data),
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			}
		}).then(checkStatus);
	}

	function resetDefinitions(data) {
		return fetch("/api/words", {
			method: "put",
			body: JSON.stringify(data),
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			}
		}).then(checkStatus);
	}

	function updateStat(data) {
		return fetch("/api/game", {
			method: "put",
			body: JSON.stringify(data),
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			}
		}).then(checkStatus);
	}

	function deleteDefinitions(data) {
		return fetch("/api/words", {
			method: "delete",
			body: JSON.stringify(data),
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			}
		}).then(checkStatus);
	}

	function resetGameStatus(data) {
		return fetch("/api/game", {
			method: "delete",
			body: JSON.stringify(data),
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			}
		}).then(checkStatus);
	}

	function checkStatus(response) {
		if (response.status >= 200 && response.status < 300) {
			return response;
		} else {
			const error = new Error(
				`HTTP Error ${response.statusText} ${response.status}`
			);
			error.status = response.statusText;
			error.response = response;
			console.log(error);
			throw error;
		}
	}

	function parseJSON(response) {
		return response.json();
	}

	return {
		createDefinition,
		getDefinitions,
		resetDefinitions,
		deleteDefinitions,
		getStat,
		submitStat,
		resetGameStatus,
		updateStat
	};
})();
