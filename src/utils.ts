export interface Position {
    position: { start: number, end: number, middle: number };
    name: string;
    isEmptyRow: boolean
}

export const getFunctionName = (selection: string) => {
    const parsed = selection.slice(0, selection.indexOf('(')).split(' ').filter((word) => {
        const exp = RegExp(/[a-zA-Z]/);
        return exp.test(word);
    });

    return parsed[parsed.length - 1];
};

export const getFunctionParams = (selection: string) => {
    const result = selection.slice(selection.indexOf('('), selection.indexOf(')') + 1).split(',').map(param => param.split(':')[0]).join(', ');
    if (result.endsWith(')')) {
        return result;
    } else {
        return `${result})`;
    }
};
           
export const insertAt = (str: string, sub: string, pos: number) => `${str.slice(0, pos)}${sub}${str.slice(pos)}`;

export const getPositions = (parameters: string, functionSignature: string): Position[] => {
    const result = parameters.split(',').reduce((memo: Position[], text) => {
        const tail = memo.slice(-1)[0];
        const lastFoundParamPosition = tail ? tail.position.end : 0;
        const start = functionSignature.indexOf(text.replace(/[(|)]/, '').trim(), lastFoundParamPosition);
        const end = functionSignature.indexOf(text.replace(/[(|)]/, '').trim(), lastFoundParamPosition) + text.replace(/[(|)]/, '').trim().length;
        const middle = start + Math.floor(((end - start) / 2));

        return [
            ...memo,
            {
                position: { start, end, middle },
                name: text.replace(/[(|)]/, '').trim(),
                isEmptyRow: false
            },
            {
                position: { start, end, middle },
                name: '|',
                isEmptyRow: true
            }
        ];
    }, []).flat();

    return result;
};

export const generateMarkers = (positions: Position[], functionSignature: string) => {
    let markers = ' '.repeat(functionSignature.length);
    positions.forEach(({ position: { start, end, middle } }) => {
        const isSmallerThan4 = end - start <= 4;

        if (isSmallerThan4) {
            markers = insertAt(markers, '^', middle);
        } else {
            for (let i = start; i < end; i++) {
                const isFirst = i === start;
                const isLast = i === end - 1;

                markers = insertAt(markers, isFirst || isLast ? '^' : '_', i);
            }
        }
    });

    return markers;
};

export const getFunctionSignature = (selection: string) => `// ${getFunctionName(selection)} ${getFunctionParams(selection)}`;
                          
export const generateVerticalLines = (positions: Position[], functionSignature: string) => {
    const verticalLines = [];
    for (let idx = 0; idx <= positions.length; idx++) {
        let lines = ' '.repeat(functionSignature.length);

        for (let i = 0; i < positions.length; i++) {
            const { position: { middle }, name, isEmptyRow } = positions[i];

            if (idx < positions.length - i) {
                if (lines.charAt(middle) !== '|' && isEmptyRow) {
                    lines = insertAt(lines, '|', middle);
                }
            }

            if (idx === positions.length - i) {
                let namePosition = middle - (name.length > 3 ? Math.floor(name.length / 2) - 1 : 0);
                lines = insertAt(lines, name, isEmptyRow ? middle : namePosition);
            }
        }

        verticalLines.push(lines);
    }
    return verticalLines;
};