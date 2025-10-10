export default function filterProgramsRank(program, res, next) {
  
  let updatedProgram = [];

  const normalize = (p, rank) => {
    const base = p.toObject ? p.toObject() : p;
    return { ...base, rank };
  };

  const programsWithScore10 = program
    .filter((p) => p.program && p.program.score === 10)
    .map((p) => {
      let rank = null;
      if ([10].includes(p.score)) rank = "first";
      else if ([7].includes(p.score)) rank = "second";
      else if ([3].includes(p.score)) rank = "third";
      return normalize(p, rank);
    });

  const programsWithScore5 = program
    .filter((p) => p.program && p.program.score === 5)
    .map((p) => {
      let rank = null;
      if ([5].includes(p.score)) rank = "first";
      else if ([3].includes(p.score)) rank = "second";
      else if ([1].includes(p.score)) rank = "third";
      return normalize(p, rank);
    });

  const programsWithScore15 = program
    .filter((p) => p.program && p.program.score === 15)
    .map((p) => {
      let rank = null;
      if ([15].includes(p.score)) rank = "first";
      else if ([10].includes(p.score)) rank = "second";
      else if ([5].includes(p.score)) rank = "third";
      return normalize(p, rank);
    });

  const programsWithScore20 = program
    .filter((p) => p.program && p.program.score === 20)
    .map((p) => {
      let rank = null;
      if ([20].includes(p.score)) rank = "first";
      else if ([15].includes(p.score)) rank = "second";
      else if ([10].includes(p.score)) rank = "third";
      return normalize(p, rank);
    });

  const programsWithScore30 = program
    .filter((p) => p.program && p.program.score === 30)
    .map((p) => {
      let rank = null;
      if ([30].includes(p.score)) rank = "first";
      else if ([20].includes(p.score)) rank = "second";
      else if ([10].includes(p.score)) rank = "third";
      return normalize(p, rank);
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
