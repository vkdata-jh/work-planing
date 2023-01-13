import React, { useState, useRef, useEffect } from "react";
import { PageContainer, EmployeeList,EmployeeItem,EmployeeForm,DeleteEmployee,employeeList, Buttons, TabButton } from "./homeStyles";
import { dogs } from "./dogsData";
import {employees} from "./zamestananci"

export default function Home() {
    document.title="Plánování práce";
	const renderCount = useRef(0);
	const employeeCount = useRef(employees.length);
	const [valid, setValid] = useState(false);
    const [validPlan,setValidPlan]=useState(false);
	const [listOfEmployees, setlistOfEmployees] = useState(employees);
	const [activeTab, setActiveTab] = useState('list-of-employees');
    const [activeRadio,setActiveRadio]=useState(false);
    const [activePlan,setActivePlan]=useState("red");

    const defaultWorkPlan ={
		minutes: 0,
		meters: 0,
		employees: 0
	};
	const [workPlan, setworkPlan] = useState(defaultWorkPlan);
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
        updatePower();

	};
	const handleDelete = (id) => {
		setlistOfEmployees(listOfEmployees.filter( employee => employee.id !== id));  
        updatePower();      
	};
	const verifyData = (data) => {
        console.log('data pro kontrolu',data,data.sex,data.name.length);
		if ( data.name.length<=0) 
            {setValid(false);}else {setValid(true)};
		console.log('proběhla kontrola-výsledek',valid);
	};
	const handlePlan = (event) => {
		setTempworkPlan({...tempworkPlan,[event.target.name]:event.target.value});   
        checkPlan();     
	};
    const checkPlan=()=>{
        if(tempworkPlan.minutes<=workPlan.minutes 
            && tempworkPlan.meters<=workPlan.meters
            && Number(tempworkPlan.minutes)>=1 && Number(tempworkPlan.meters)>=1
            ){
            setValidPlan(true);
            setActivePlan("green");
        }else{setValidPlan(false);
            setActivePlan("red");}
    };

	const updatePower = () => {
		let meter=0;
        const minutes=listOfEmployees.length*60;
        listOfEmployees.map((employee)=>(
            meter+=employee.power
        ));
        const employeesCount=listOfEmployees.length;
        setworkPlan({...workPlan,minutes:minutes,meters:meter,employees:employeesCount});
		
		
	};

	const switchTab = (e, newValue) => {
		e.preventDefault();
		const newActiveTab = newValue;
		setActiveTab(newActiveTab);
	};

	useEffect(() => {
        updatePower();        
	}, [addEmployee]);
    useEffect(()=>{
        checkPlan();        
    });
    
	

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
									<>příjmení&nbsp;&nbsp;</>	{employee.name}&nbsp;&nbsp;/&nbsp;<>&nbsp;</> {employee.power}&nbsp;m&nbsp;/&nbsp;hod.&nbsp;
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
						
                        <label >muž&nbsp;<input type="radio" name="sex" value="0" onChange={handleChange} checked/></label>
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
							onChange={handlePlan}
						/>
						<input
							type="number"
							placeholder="metry"
							className="inputClass"
							name="meters"
							value={tempworkPlan.meters}
							onChange={handlePlan}
						/>
						
						<TabButton
                            name={activePlan}  
                            type="reset"  
                        style={{background:`${activePlan}`}}                    
							className="inputClass"
							disabled={!validPlan}
						>
							Plán
						</TabButton>
					</EmployeeForm>
				</>
			}
		</PageContainer>
	);
}
