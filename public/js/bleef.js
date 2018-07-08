class MainDashboard extends React.Component {
	state = {
		definitions: [],
		word: "",
		player: "",
		definition: "",
		checked: false,
		directorSelected: false,
		buttonDisabled: true
	};

	componentDidMount() {
		this.loadDefinitionsFromServer();
		//setInterval(this.loadDefinitionsFromServer, 1500);
		//setInterval(this.loadGameStatus, 600);
	}

	loadDefinitionsFromServer = () => {
		client.getDefinitions(serverDefinitions =>
			this.setState({ definitions: serverDefinitions })
		);
	};

	loadGameStatus = () => {
		client.getStat(serverStatus => {
			console.log("director status is " + serverStatus[0].directorSelected);
			this.setState({
				directorSelected: serverStatus[0].directorSelected
			});
		});
	};

	createDefinition = definition => {
		const d = helpers.newDefinition(definition);
		this.setState({
			definitions: this.state.definitions.concat(d)
		});
		client.createDefinition(d);
		this.setState({
			player: "",
			word: "",
			definition: ""
		});
	};

	handlePlayerChange = e => {
		this.setState({ player: e.target.value });
	};

	handleWordChange = e => {
		this.setState({ word: e.target.value });
	};

	handleDefinitionChange = e => {
		this.setState({ definition: e.target.value });
	};

	handleCreateFormSubmit = () => {
		let definition = {
			word: this.state.word,
			player: this.state.player,
			definition: this.state.definition
		};
		this.setState({ buttonDisabled: true });
		this.createDefinition(definition);
	};

	showList = () => {
		this.setState({ showList: false });
	};

	handleCheckboxChange = () => {
		this.setState({
			checked: true,
			directorSelected: this.state.checked
		});
		client.updateStat({ directorSelected: true });
	};

	handleEndgameUp = () => {
		this.setState({ checked: false, buttonDisabled: true });
		client.updateStat({ directorSelected: false });
	};

	render() {
		const { word, player, definition } = this.state;
		const enableCheckBox = player.length > 2;
		if (word.length > 1 && player.length > 2 && definition.length > 3) {
			this.state.buttonDisabled = false;
		}
		return (
			<div>
				<div className="ui centered card">
					<div className="content">
						<div className="ui form">
							<div className="field">
								<label>Jugador</label>
								<div className="ui grid">
									<div className="ten wide column">
										<input
											type="text"
											value={this.state.player}
											onChange={this.handlePlayerChange}
										/>
									</div>
									<div className="four wide column middle aligned">
										<div className="ui checkbox">
											<input
												disabled={this.state.directorSelected}
												type="checkbox"
												name="director"
												onChange={this.handleCheckboxChange}
												checked={this.state.checked}
											/>
											<label>Director?</label>
										</div>
									</div>
								</div>
							</div>
							<div className="field">
								<label>Palabra</label>
								<input
									type="text"
									value={this.state.word}
									onChange={this.handleWordChange}
								/>
							</div>
							<div className="field">
								<label>Significado</label>
								<textarea
									rows="7"
									onChange={this.handleDefinitionChange}
									value={this.state.definition}
								/>
							</div>
							<div className="ui bottom">
								<button
									className="large ui primary blue button fluid"
									onClick={this.handleCreateFormSubmit}
									disabled={this.state.buttonDisabled}
								>
									Enviar
								</button>
							</div>
						</div>
					</div>
				</div>
				<DefinitionList
					definition={word}
					definitions={this.state.definitions}
					handleShowList={this.state.checked}
					handleEndgameUp={this.handleEndgameUp}
				/>
				<div className="ui one column centered grid" />
			</div>
		);
	}
}

class DefinitionList extends React.Component {
	state = {
		//showList: this.props.handleShowList,
	};

	handleEndGame = () => {
		client.deleteDefinitions();
		this.props.handleEndgameUp();
	};

	render() {
		if (this.props.handleShowList) {
			const players = this.props.definitions.map(definition => (
				<Votante key={definition.id} player={definition.player} />
			));

			const definitions = this.props.definitions.map(definition => (
				<div>
					<Definition
						key={definition.id}
						id={definition.id}
						player={definition.player}
						word={definition.word}
						definition={definition.definition}
						voters={players}
					/>
				</div>
			));

			return (
				<div className="ui one column centered grid">
					<div className="row">
						{definitions.length > 0 ? <h2>Las definiciones son:</h2> : <div />}
						<div className="column">{definitions}</div>
						{definitions.length > 0 ? (
							<EndGame endGame={this.handleEndGame} />
						) : (
							<div />
						)}
					</div>
				</div>
			);
		} else {
			return <div />;
		}
	}
}

class Definition extends React.Component {
	render() {
		return (
			<div className="ui one column centered grid">
				<div className="row">
					<div className="column">
						<div className="ui centered card">
							<div className="content">
								<label className="header">
									{" "}
									<span className="ui green header">
										{this.props.word}
									</span>{" "}
									<span className="ui gray label middle aligned">
										Autor: {this.props.player}
									</span>
								</label>
								<div style={{ wordWrap: "break-word" }}>
									{this.props.definition}
								</div>
								<div className="floated left">Votantes:{this.props.voters}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

class EndGame extends React.Component {
	render() {
		return (
			<div className="row">
				<button className="large ui red button" onClick={this.props.endGame}>
					Finalizar Partida
				</button>
			</div>
		);
	}
}

class Votante extends React.Component {
	render() {
		return (
			<div>
				<div className="ui checkbox">
					<input type="checkbox" name="public" />
					<label>{this.props.player}</label>
				</div>
			</div>
		);
	}
}

ReactDOM.render(<MainDashboard />, document.getElementById("content"));
