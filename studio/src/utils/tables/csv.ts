function splitLine(line: string, delimiters: string[]) {
    let values: string[] = [];
    for (let i = 0; i < delimiters.length; i++) {
        const locValues: string[] = [];
        let term = '';
        let inQuotes = false;
        let quoteSymbol = '';
        for (const c of line) {
            if ((c === '"' || c === "'") && !inQuotes) {
                inQuotes = !inQuotes;
                quoteSymbol = c;
            } else if (c === quoteSymbol && inQuotes) {
                inQuotes = !inQuotes;
            } else if (c === delimiters[i] && !inQuotes) {
                locValues.push(term);
                term = '';
            } else {
                term += c;
            }
        }
        locValues.push(term);
        values = locValues;
    }
    return values;
}

function detectDelimiter(line: string): string {
    const possibleDelimiters = [',', ';', '\t', '|', '-'];
    let maxCount = 0;
    let detectedDelimiter = ',';

    possibleDelimiters.forEach((delimiter) => {
        const count = line.split(delimiter).length - 1;

        if (count > maxCount) {
            maxCount = count;
            detectedDelimiter = delimiter;
        }
    });

    return detectedDelimiter;
}

export function parseCSV(csv: string, delimiter?: string) {
    const lines = csv.split('\n');
    if (!delimiter) delimiter = detectDelimiter(lines[0]);

    const data: string[][] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line === '') continue;
        data.push(splitLine(line, [delimiter]));
    }

    return { data };
}
