import { z } from "zod";

export const lessonLibrarybaseSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string(),
  property: z.string(),
  createdAt: z.string(),
  lessonHour: z.number(),
  evaluation: z.string(),
  lessonContents: z.array(
    z.object({
      _id: z.string().optional(),
      type: z.string(),
      link: z.string().optional(),
      lessonContentdownloadURL: z.string(),
      lessonContenFileName: z.string(),
      lessonContendescription: z
        .string({
          required_error: "컨텐츠 자료설명을 입력하세요.",
        })
        .min(1, { message: "컨텐츠 자료설명을 입력하세요." }),
      file: z.instanceof(File).optional(),
    })
  ),
  lessonDirective: z.object({
    _id: z.string().optional(),
    LessonDirectiveURL: z.string().optional(),
    type: z.string().optional(),
    contentdescription: z.string().optional(),
    file: z.any().optional(),
  }),
  liveSurvey: z.string().optional(),
  type: z.string(),
});

export type lessonLibrarybaseSchemType = z.infer<
  typeof lessonLibrarybaseSchema
>;
