function displayAnswer(e: MouseEvent) {
    if (discardPick) {
        return;
    }
    const intersectionResults = mapView.intersectMapObjects(e.pageX, e.pageY);
    const usableResults = intersectionResults.filter(result => result.userData !== undefined);
    if (usableResults.length > 0) {
        const name = usableResults[0].userData.name;
        const correct = name === askedName;
        setStyleSet({ name, correct });
        // Discard the picking when the StyleSet is changed so that the new tiles have the time
        // to be generated before changing them all over again.
        discardPick = true;
        setTimeout(
            () => {
                if (correct) {
                    askName();
                }
                setStyleSet();
                discardPick = false;
            },
            // If the answer is correct, wait a longer time so that the user has time to see the
            // correct result in case he was clicking fast and randomly.
            correct ? 1000 : 300
        );
    }
}
