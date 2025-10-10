// filterProgramsRank.js
export default function filterProgramsRank(program, res, next) {
  if (!program)
    return next(new CustomError("Program not found or not declared"));
  let updatedProgram = [];

  const programsWithScore10 = program
    .filter((p) => p.program && p.program.score === 10)
    .map((p) => {
      let rank = null;
      if ([10].includes(p.score)) rank = "first";
      else if ([7].includes(p.score)) rank = "second";
      else if ([3].includes(p.score)) rank = "third";

      return { ...p.toObject(), rank };
    });

  const programsWithScore5 = program
    .filter((p) => p.program && p.program.score === 5)
    .map((p) => {
      let rank = null;
      if ([5].includes(p.score)) rank = "first";
      else if ([3].includes(p.score)) rank = "second";
      else if ([1].includes(p.score)) rank = "third";

      return { ...p.toObject(), rank };
    });

  const programsWithScore15 = program
    .filter((p) => p.program && p.program.score === 15)
    .map((p) => {
      let rank = null;
      if ([15].includes(p.score)) rank = "first";
      else if ([10].includes(p.score)) rank = "second";
      else if ([5].includes(p.score)) rank = "third";

      return { ...p.toObject(), rank };
    });

  const programsWithScore20 = program
    .filter((p) => p.program && p.program.score === 20)
    .map((p) => {
      let rank = null;
      if ([20].includes(p.score)) rank = "first";
      else if ([15].includes(p.score)) rank = "second";
      else if ([10].includes(p.score)) rank = "third";

      return { ...p.toObject(), rank };
    });

  const programsWithScore30 = program
    .filter((p) => p.program && p.program.score === 30)
    .map((p) => {
      let rank = null;
      if ([30].includes(p.score)) rank = "first";
      else if ([20].includes(p.score)) rank = "second";
      else if ([10].includes(p.score)) rank = "third";

      return { ...p.toObject(), rank };
    });

  updatedProgram = [
    ...programsWithScore10,
    ...programsWithScore5,
    ...programsWithScore15,
    ...programsWithScore20,
    ...programsWithScore30,
  ].sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));

  res.json(updatedProgram);
  
}
