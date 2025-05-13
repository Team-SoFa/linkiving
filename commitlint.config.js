module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "Feat",
        "Fix",
        "Docs",
        "Style",
        "Refactor",
        "Test",
        "Chore",
        "Design",
        "Comment",
        "Rename",
        "Remove",
      ],
    ],
    "type-case": [2, "always", "pascal-case"],
    "type-empty": [2, "never"], // type 필수 작성
    "subject-empty": [2, "never"], // subject 필수 작성
    "subject-case": [2, "always", "sentence-case"], // subject 첫 글자는 대문자
    "subject-full-stop": [2, "never", "."], // 서브젝트 끝에 마침표를 사용하지 않음
  },
  plugins: [
    {
      rules: {
        "header-match-team-format": ({ header }) => {
          const match = /^[A-Z][a-zA-Z]*: .+/.test(header);
          return [
            valid,
            `❌ 커밋 메시지는 "타입: 설명" 형식을 따라야 합니다:
            ✅ 예시:
              Feat: Example feature`,
          ];
        },
      },
      "body-bullet-format": ({ body }) => {
          if (!body || body.trim() === "") return [true];

          const lines = body.trim().split("\n");
          const invalidLines = lines.filter(
            (line) => line.trim() !== "" && !/^-\s.+/.test(line.trim())
          );

          const isValid = invalidLines.length === 0;
          return [
            isValid,
            `❌ 본문 각 줄은 "- "로 시작해야 합니다.
            ✅ 예시:
              - body example`,
          ];
        },
    },
  ],
};
