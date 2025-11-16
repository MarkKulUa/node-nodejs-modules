const parseEnv = () => {
  const processEnv = process.env;

  const res = Object.entries(processEnv)
      .filter(([key, value]) => key.startsWith('RSS_'))
      .map(([key, value]) => `${key}=${value}`)
      .join('; ')

      console.log(res);
};

parseEnv();
