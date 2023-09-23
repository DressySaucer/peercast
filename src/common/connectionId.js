const generateId = () => {
    const id = Math.floor(Date.now() / 1000 + Math.max(Math.random(), 0.5) * 100000000);
    console.log("New id generated:", id);
    return id;
}

export default generateId;