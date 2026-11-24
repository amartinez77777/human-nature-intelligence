# Research method | Stage 01

Used PyMuPDF to open the uploaded PDF directly, read the copyright and contents pages, identify numbered chapter openings, inspect early, middle and late text extraction, and match each contents-section heading against extractable pages in its chapter range. The PDF contains 690 physical pages with a searchable text layer. The source PDF is fingerprinted with SHA-256 in `PDF_SOURCE_MANIFEST.json`.

- Front matter contains image-only pages, so isolated empty text pages are not evidence of absent content. Pages 1, 3, and 4 were detected as image/nontext front matter.
- Original PDF appears rendered by PDFium; its metadata does not establish print format. The 2018 Viking copyright page lists three ISBNs, but no single selected ISBN is asserted.
- Chapter boundaries are derived from 18 actual chapter-opening pages, then next chapter minus one; chapter 18 ends at page 642 because Acknowledgments begins at page 643. The mapping is **PDF physical pages**, not printed pages.
- The table of contents and chapter body supply section headings. 60 major section headings were found in chapter text (some line wrapping differs). Section heading matches do not imply full-content review.
- Stage 01 paraphrases: portions of Chapter 1 (including the Pericles account and confirmation bias discussion) and Chapter 2 (the narcissism spectrum and empathy discussion). Chapters 3–18 were structurally indexed only.
- No secondary books, journal articles, archive documents, or historical sources were consulted. Thus scientific findings are absent and historical case facts have no independent confirmation.
- No full-page OCR was required. No completeness assurance beyond ordered headings, extraction spot checks, and range checks is claimed.

Source fields use `pdfPageIndex` in the zero-based range 0..689. Direct user-facing labels include the one-based viewer equivalent. Index entries refer to printed edition pages but cannot be mapped reliably from the available PDF.
