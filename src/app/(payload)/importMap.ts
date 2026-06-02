import { CollectionCards, FolderField, FolderTableCell } from '@payloadcms/next/rsc'
import {
  RscEntryLexicalCell,
  RscEntryLexicalField,
  LexicalDiffComponent,
} from '@payloadcms/richtext-lexical/rsc'

export const importMap = {
  '@payloadcms/next/rsc#CollectionCards': CollectionCards,
  '@payloadcms/next/rsc#FolderField': FolderField,
  '@payloadcms/next/rsc#FolderTableCell': FolderTableCell,
  '@payloadcms/richtext-lexical/rsc#RscEntryLexicalCell': RscEntryLexicalCell,
  '@payloadcms/richtext-lexical/rsc#RscEntryLexicalField': RscEntryLexicalField,
  '@payloadcms/richtext-lexical/rsc#LexicalDiffComponent': LexicalDiffComponent,
}
