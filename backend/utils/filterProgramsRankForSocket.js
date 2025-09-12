import filterProgramsRank from "./resultFunction.js";

export function filterProgramsRankForSocket(program) {
  return new Promise((resolve, reject) => {
    const res = {
      json: (data) => resolve(data),
    };
    const next = (err) => reject(err);

    try {
      filterProgramsRank(program, res, next);
    } catch (error) {
      reject(error);
    }
  });
}
