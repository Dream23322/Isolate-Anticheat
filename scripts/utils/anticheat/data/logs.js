import data from "../../../data/data";

export function addLogs(message) {
    data.recentLogs.push(message);
}

export function addAdminLogs(message) {
    data.recentAdminLogs.push(message);
}