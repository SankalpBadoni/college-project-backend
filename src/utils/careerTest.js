export const computeCompetencyScores = (template, answers) => {
  const scores = {};

  for (const answer of answers) {
    const question = template.questions[answer.questionIndex];
    if (!question) {
      continue;
    }

    const selected = question.options[answer.selectedOptionIndex];
    if (!selected) {
      continue;
    }

    for (const [competency, weight] of selected.competencyWeights.entries()) {
      scores[competency] = (scores[competency] || 0) + Number(weight || 0);
    }
  }

  const labels = Object.keys(scores);
  const values = labels.map((label) => scores[label]);

  return {
    scores,
    spiderWebData: { labels, values }
  };
};
