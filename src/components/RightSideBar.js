import React from "react";

const RightSideBar = ({ products, onTypeButtonClick, selector }) => {
	const uniqueType =
		selector === "type"
			? [...new Set(products.map((product) => product.type))]
			: [...new Set(products.map((product) => product.seller))];
	return (
		<div className="r-sideBar">
			<div>
				<h2> {selector === "type" ? "انواع المنتجات" : "البائعون"}</h2>
				<div className="r-sideBar-types">
					<div className="r-sideBar-types-list">

						<label
							className="sidebar-label-container"
							key={"all"}>
							<input
								type="radio"
								name={selector}
								defaultChecked
								onClick={() =>
									onTypeButtonClick(selector === "type" ? null : "All")
								}
							/>
							<span className="checkmark"></span>
							<span className="selected">الكل</span>
						</label>

						{uniqueType.map((type) => (
							<label
								className="sidebar-label-container"
								key={type}>
								<input
									name={selector}
									type="radio"
									onClick={() => onTypeButtonClick(type)}
								/>
								<span className="checkmark"></span>
								<span className="selected">{type}</span>
							</label>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default RightSideBar;
