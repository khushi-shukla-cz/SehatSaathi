import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const scenarios = [
  {
    question: "Someone is choking and can't speak. What should you do first?",
    options: [
      "Give them water",
      "Perform abdominal thrusts (Heimlich)",
      "Call emergency services",
      "Encourage them to cough"
    ],
    answer: 3,
    explanation: "Encourage them to cough first. If they can't, then perform abdominal thrusts."
  },
  {
    question: "How should you treat a minor burn?",
    options: [
      "Apply butter",
      "Run under cool water",
      "Pop any blisters",
      "Apply ice directly"
    ],
    answer: 1,
    explanation: "Run the burn under cool water for at least 10 minutes."
  },
  {
    question: "What is the first step if someone is bleeding heavily?",
    options: [
      "Apply pressure to the wound",
      "Wash with soap",
      "Give them water",
      "Remove any embedded object"
    ],
    answer: 0,
    explanation: "Apply pressure to stop the bleeding. Do not remove embedded objects."
  }
];

export default function FirstAidGame() {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);

  const scenario = scenarios[idx];

  const handleOption = (i: number) => {
    setSelected(i);
    setShowFeedback(true);
    if (i === scenario.answer) setScore((s) => s + 1);
  };

  const next = () => {
    setSelected(null);
    setShowFeedback(false);
    setIdx((i) => i + 1);
  };

  if (idx >= scenarios.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <Card className="max-w-xl w-full">
          <CardHeader>
            <CardTitle>Game Over!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl mb-2">Your final score: {score} / {scenarios.length}</div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => { setIdx(0); setScore(0); }}>Play Again</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <Card className="max-w-xl w-full">
        <CardHeader>
          <CardTitle>First Aid Step Game</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-semibold mb-4">Q{idx + 1}: {scenario.question}</div>
          <div className="space-y-2">
            {scenario.options.map((opt, i) => (
              <Button
                key={i}
                variant={selected === i ? (i === scenario.answer ? "default" : "destructive") : "outline"}
                className="w-full text-left"
                disabled={showFeedback}
                onClick={() => handleOption(i)}
              >
                {opt}
              </Button>
            ))}
          </div>
          {showFeedback && (
            <div className={`mt-4 p-3 rounded-md ${selected === scenario.answer ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
              <div className="font-bold">{selected === scenario.answer ? "Correct!" : "Incorrect!"}</div>
              <div>{scenario.explanation}</div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          {showFeedback && (
            <Button onClick={next}>
              {idx === scenarios.length - 1 ? "Finish" : "Next"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
