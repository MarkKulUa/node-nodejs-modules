const parseArgs = () => {
    const args = process.argv.slice(2);

    const acc = args.reduce((acc, arg, index) => {
        if (index % 2 === 0 && arg.startsWith('--')) {
            const key = arg.slice(2);
            const value = args[index + 1] || '';
            acc.push(`${key} is ${value}`);
        }
        return acc;
    }, [])

    console.log(acc.join(', '));
};

parseArgs();
