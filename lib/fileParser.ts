export async function extractTextFromFile(file: File): Promise<string> {
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (extension === 'pdf') {
        try {
            // Dynamically import to prevent SSR/Webpack issues on initial load
            const pdfjsLib = await import('pdfjs-dist');
            if (typeof window !== 'undefined') {
                pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
            }
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;

            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(' ');
                fullText += pageText + '\n';
            }
            return fullText.trim();
        } catch (error: any) {
            console.error('Error parsing PDF:', error);
            throw new Error(`PDF Error: ${error?.message || 'Failed to parse document.'}`);
        }
    }

    if (extension === 'docx') {
        try {
            // Dynamically import
            const mammoth = await import('mammoth');
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer });
            return result.value.trim();
        } catch (error: any) {
            console.error('Error parsing DOCX:', error);
            throw new Error(`DOCX Error: ${error?.message || 'Failed to parse document.'}`);
        }
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                const text = e.target?.result;
                if (typeof text === 'string') {
                    resolve(text);
                } else {
                    reject(new Error("Unable to read file as string."));
                }
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => reject(new Error("Failed to read file"));

        if (extension === 'txt' || extension === 'md' || extension === 'csv') {
            reader.readAsText(file);
        } else {
            console.warn("Parsing non-text files as raw text. Results may be garbled unless a specific parser is added.");
            reader.readAsText(file);
        }
    });
}
