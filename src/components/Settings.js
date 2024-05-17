import { useState, useEffect } from "react";
import { FaBuilding } from "react-icons/fa";

const Settings = () => {
	const [settings, setSettings] = useState(" ")
	const [title, setTitle] = useState(" ")

	const handlSettings = () => {
		fetch(`http://localhost:8080/settings/1`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				title: title,
			})
		})
	}


	useEffect(() => {
		fetch("http://localhost:8080/settings/1")
			.then((response) => response.json())
			.then((data) => {
				setSettings(data);
				setTitle(data.title)
			})
	}, [])



	return (
		<div className="settings">
			<div>
				<h2>
					تعديل الاعدادات
				</h2>
			</div>
			<div className="creatRecept settings-container">
				<label>
					<FaBuilding style={{ marginLeft: "5px" }} />
					اسم الشركة
				</label>
				<input
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
				<button
					id="settings-done"
					onClick={handlSettings}
				>تعديل</button>
			</div>
		</div>
	);
};

export default Settings