import React, { useState, useRef, useEffect } from "react";
import { PageContainer, EmployeeList,EmployeeItem,EmployeeForm,DeleteEmployee,employeeList, Buttons, TabButton } from "./homeStyles";
import { dogs } from "./dogsData";
import {employees} from "./zamestananci"

export default function Home() {
    document.title="Plánování práce";
	const renderCount = useRef(0);
	const employeeCount = useRef(employees.length);
	const [valid, setValid] = useState(false);
	const [listOfEmployees, setlistOfEmployees] = useState(employees);
	const [activeTab, setActiveTab] = useState('list-of-employees');
    const [activeRadio,setActiveRadio]=useState(false);

    const defaultWorkPlan ={
		minutes: 0,
		meters: 0,
		employees: 0
	};
	const [workPlan, setworkPlan] = useState();
	const [tempworkPlan, setTempworkPlan] = useState(defaultWorkPlan);
	const malePower = 1;
    const femalePower=0.5;
	const [addEmployee, setAddEmployee] = useState({
		id: (employeeCount.current + 1),
		name: "",
		sex: 10,
		power: 0
	});

	const handleChange = (e) => {
        console.log('handle',e.target);
        (Number([e.target.value])===1)? setAddEmployee({...addEmployee, [e.target.name]:e.target.value,power:0.5}):setAddEmployee({...addEmployee, [e.target.name]:e.target.value,power:1});
        verifyData(addEmployee);
	};
	const handleAdd = (e) => {
		e.preventDefault();
        
		setlistOfEmployees((listOfEmployees) => {
			return [...listOfEmployees, addEmployee];
		});
		employeeCount.current++;
		setAddEmployee({
			id: (employeeCount.current + 1),
			name: "",
			sex: 10,
			power: 0
		});
	};
	const handleDelete = (id) => {
		setlistOfEmployees(listOfEmployees.filter( employee => employee.id != id));        
	};
	const verifyData = (data) => {
        console.log('data pro kontrolu',data,data.sex,data.name.length);
		if ( data.name.length<=0) 
            {setValid(false);}else {setValid(true)};
		console.log('proběhla kontrola-výsledek',valid);
	};
	const handlePower = (e) => {
		setTempworkPlan({ ...tempworkPlan, [e.target.name]: e.target.value});
	};

	const updatePower = async () => {
		const PowerValue = tempworkPlan;
		let newPowerValue = {};
		// PowerValue = {minutes: "", meters: "", employees: ""}
		const keys = Object.keys(PowerValue);
		// keys = ['minutes', 'meters', 'employees']
		// key = keys[1]
		keys.map((key) => {
			// PowerValue.meters
			if (parseInt(PowerValue[key])) {
				newPowerValue[key] = parseInt(workPlan[key]) + parseInt(PowerValue[key]);
			} else {
				newPowerValue[key] = parseInt(workPlan[key]);
			}
		})
		await setworkPlan(newPowerValue);
		await setTempworkPlan({ minutes: "", meters: "", employees: ""});
		console.log(workPlan);
	};

	const switchTab = (e, newValue) => {
		e.preventDefault();
		const newActiveTab = newValue;
		setActiveTab(newActiveTab);
	};

	// useEffect(() => {
    //     console.log("stav valid",valid,"render count",renderCount);	  
	//     renderCount.current++;	  
	// }, [addEmployee]);
	// useEffect(() => {
	//   renderCount.current++;
	// },[]);

	return (
		<PageContainer>
			<Buttons>
				<TabButton name="list-of-employees" activeTab={activeTab} onClick={(event) => { switchTab(event, 'list-of-employees') }}>
					Seznam zaměstnanců
				</TabButton>
				<TabButton name="work-plan" activeTab={activeTab} onClick={(event) => { switchTab(event, 'work-plan') }}>
					Pracovní plán
				</TabButton>
			</Buttons>
			{ (activeTab === 'list-of-employees') && 
				<>
					<EmployeeList name="employeeList">
						{
								listOfEmployees.map((employee) => (
									<EmployeeItem key={employee.id} name={employee.name}>
										{employee.name} / {employee.sex} / {employee.power}
										<DeleteEmployee
											onClick={() => {handleDelete(employee.id)}}
										>
											x
										</DeleteEmployee>
									</EmployeeItem>
								))
						}
					</EmployeeList>
					<EmployeeForm name="employeeForm">
                        
						<input
							type="text"
							placeholder="jméno zaměstnance"
							className="inputClass"
							name="name"
							value={addEmployee.name}
							onChange={handleChange}
						/>
						
                        <label >muž&nbsp;<input type="radio" name="sex" value="0" onChange={handleChange}/></label>
                        <label>žena<input type="radio" name="sex" value="1" onChange={handleChange}/></label>	

						<button
							className="inputClass"
							onClick={handleAdd}
                            disabled={!valid}
						>
							Přidat
						</button>
                        
					</EmployeeForm>
				</>
			}
			{ (activeTab === 'work-plan') &&
				<>
					<EmployeeForm style={{ flexDirection: 'column '}}>
						<div
							className="inputClass"
							style={{color: 'white', height: 'auto'}}
						>
							<b>Aktuální zásoby</b>
							<p>
								člověkominut: {workPlan.minutes},
								člověkometrů: {workPlan.meters},
								zaměstnanců: {workPlan.employees}
							</p>
						</div>
						<input
							type="number"
							placeholder="minuty"
							className="inputClass"
							name="minutes"
							value={tempworkPlan.minutes}
							onChange={handlePower}
						/>
						<input
							type="number"
							placeholder="metry"
							className="inputClass"
							name="meters"
							value={tempworkPlan.meters}
							onChange={handlePower}
						/>
						
						<button
							className="inputClass"
							onClick={updatePower}
						>
							Plán
						</button>
					</EmployeeForm>
				</>
			}
		</PageContainer>
	);
}
