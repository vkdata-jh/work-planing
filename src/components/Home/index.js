import React, { useState, useRef, useEffect } from "react";
import { PageContainer, DogList, DogItem, DogForm, Buttons, TabButton, KillTheDog } from "./homeStyles";
import { dogs } from "./dogsData";

export default function Home() {
	const renderCount = useRef(0);
	const dogsCount = useRef(dogs.length);
	const [valid, setValid] = useState(false);
	const [listOfDogs, setListOfDogs] = useState(dogs);
	const [activeTab, setActiveTab] = useState('list-of-dogs');
	const [shelterStorage, setShelterStorage] = useState({
		food: 35,
		vaccine: 15,
		pills: 20
	});
	const [tempShelterStorage, setTempShelterStorage] = useState({
		food: "",
		vaccine: "",
		pills: ""
	});
	const dogsRequirements = {
		food: 5,
		vaccine: 1,
		pills: 2
	};
	const [addDog, setAddDog] = useState({
		id: (dogsCount.current + 1),
		name: "",
		race: "",
		age: 0
	});

	const handleChange = (e) => {
		setAddDog({...addDog, [e.target.name]: e.target.value});
		// verifyData(addDog);
	};
	const handleAdd = (e) => {
		e.preventDefault();
		setListOfDogs((listOfDogs) => {
			return [...listOfDogs, addDog];
		});
		dogsCount.current++;
		setAddDog({
			id: (dogsCount.current + 1),
			name: "",
			race: "",
			age: 0
		});
	};
	const handleDelete = (id) => {
		setListOfDogs(listOfDogs.filter( dog => dog.id != id));
	};
	const verifyData = (data) => {
		if (parseInt(data.age) > 0 && parseInt(data.age) < 25) {
			return setValid(false);
		}
		if (data.name === "" || data.name.trim().length <= 0) {
			return setValid(false);
		}
		if (data.race === "" || data.race.trim().length <= 0) {
			return setValid(false);
		}
		setValid(true);
	};
	const handleStorage = (e) => {
		setTempShelterStorage({ ...tempShelterStorage, [e.target.name]: e.target.value});
	};

	const updateStorage = async () => {
		const storageValue = tempShelterStorage;
		let newStorageValue = {};
		// storageValue = {food: "", vaccine: "", pills: ""}
		const keys = Object.keys(storageValue);
		// keys = ['food', 'vaccine', 'pills']
		// key = keys[1]
		keys.map((key) => {
			// storageValue.vaccine
			if (parseInt(storageValue[key])) {
				newStorageValue[key] = parseInt(shelterStorage[key]) + parseInt(storageValue[key]);
			} else {
				newStorageValue[key] = parseInt(shelterStorage[key]);
			}
		})
		await setShelterStorage(newStorageValue);
		await setTempShelterStorage({ food: "", vaccine: "", pills: ""});
		console.log(shelterStorage);
	};

	const switchTab = (e, newValue) => {
		e.preventDefault();
		const newActiveTab = newValue;
		setActiveTab(newActiveTab);
	};

	// useEffect(() => {
	//   if (renderCount.curren > 0) {
	//     verifyData(addDog);
	//   }
	// }, [addDog]);
	// useEffect(() => {
	//   renderCount.curren++;
	// },[]);

	return (
		<PageContainer>
			<Buttons>
				<TabButton name="list-of-dogs" activeTab={activeTab} onClick={(event) => { switchTab(event, 'list-of-dogs') }}>
					Seznam Psů
				</TabButton>
				<TabButton name="shelter-storage" activeTab={activeTab} onClick={(event) => { switchTab(event, 'shelter-storage') }}>
					Sklad útulku
				</TabButton>
			</Buttons>
			{ (activeTab === 'list-of-dogs') && 
				<>
					<DogList name="dogList">
						{
								listOfDogs.map((dog) => (
									<DogItem key={dog.id} name={dog.name}>
										{dog.name} / {dog.race} / {dog.age}
										<KillTheDog
											onClick={() => {handleDelete(dog.id)}}
										>
											x
										</KillTheDog>
									</DogItem>
								))
						}
					</DogList>
					<DogForm name="dogForm">
						<input
							type="text"
							placeholder="jméno psa"
							className="inputClass"
							name="name"
							value={addDog.name}
							onChange={handleChange}
						/>
						<input
							type="text"
							placeholder="rasa psa"
							className="inputClass"
							name="race"
							value={addDog.race}
							onChange={handleChange}
						/>
						<input
							type="number"
							min="0"
							max="25"
							placeholder="věk psa"
							className="inputClass"
							name="age"
							value={addDog.age}
							onChange={handleChange}
						/>
						<button
							className="inputClass"
							onClick={handleAdd}
						>
							Přidat
						</button>
					</DogForm>
				</>
			}
			{ (activeTab === 'shelter-storage') &&
				<>
					<DogForm style={{ flexDirection: 'column '}}>
						<div
							className="inputClass"
							style={{color: 'white', height: 'auto'}}
						>
							<b>Aktuální zásoby</b>
							<p>
								krmivo: {shelterStorage.food},
								vakcíny: {shelterStorage.vaccine},
								tabletky: {shelterStorage.pills}
							</p>
						</div>
						<input
							type="number"
							placeholder="krmivo (kg)"
							className="inputClass"
							name="food"
							value={tempShelterStorage.food}
							onChange={handleStorage}
						/>
						<input
							type="number"
							placeholder="vakcíny (ks)"
							className="inputClass"
							name="vaccine"
							value={tempShelterStorage.vaccine}
							onChange={handleStorage}
						/>
						<input
							type="number"
							placeholder="tabletky (ks)"
							className="inputClass"
							name="pills"
							value={tempShelterStorage.pills}
							onChange={handleStorage}
						/>
						<button
							className="inputClass"
							onClick={updateStorage}
						>
							Doplnit zásoby
						</button>
					</DogForm>
				</>
			}
		</PageContainer>
	);
}
