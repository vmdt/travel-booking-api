const transform = (obj, predicate) => {
	return Object.keys(obj).reduce((memo, key) => {
		if (predicate(obj[key], key)) {
			memo[key] = obj[key];
		}
		return memo;
	}, {});
};

const omit = (obj, items) =>
	transform(obj, (value, key) => !items.includes(key));

function isEmail(email) {
	const regexExp =
		/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
	return regexExp.test(email);
}

function isDataURL(value) {
	const dataUrlRegex =
		/^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\\/?%\s]*)\s*$/i;
	return dataUrlRegex.test(value);
}

function filterOut(obj, ...fields) {
	const newObj = { ...obj };
	fields.forEach((field) => {
		delete newObj[field];
	});
	return newObj;
}

function sortObject(obj) {
	const sorted = {};
	const str = [];
	let key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) {
			str.push(encodeURIComponent(key));
		}
	}
	str.sort();
	for (key = 0; key < str.length; key++) {
		sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
	}
	return sorted;
}

function formatRevenue(data, startDate, endDate, period = "month") {
	const periods = [];
	while (startDate <= endDate) {
		const formattedDate =
			period === "month"
				? `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}`
				: startDate.toISOString().split("T")[0]

		periods.push(formattedDate);
		if (period === "month") {
			startDate.setMonth(startDate.getMonth() + 1);
		} else {
			startDate.setDate(startDate.getDate() + 1);
		}
	}

	const result = periods.map((date) => {
		const found = data.find((item) => item.date === date);
		return {
			date,
			revenue: found ? found.revenue : 0,
		};
	});

	return result;
}

function createEndDate(startDate, duration) {
	const endDate = new Date(startDate);
	endDate.setDate(endDate.getDate() + Math.ceil(duration));
	return endDate;
}

module.exports = {
	omit,
	isEmail,
	isDataURL,
	filterOut,
	sortObject,
	formatRevenue,
	createEndDate,
};
