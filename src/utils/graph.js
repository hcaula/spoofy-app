const removeDots = function (str) {
    let index = str.indexOf('.');
    while (index >= 0) {
        str = str.replace('.', '');
        index = str.indexOf('.');
    }

    return str;
}

class GraphHelper {

    searchByField = function (value, param, array) {
        let index = -1;
        array.forEach((el, i) => {
            if (el[param] === value) {
                index = i;
                return;
            }
        });
        return index;
    }

    setGenreNodes(users, default_weight) {
        let genreNodes = [];
        users.forEach(u => {
            let userCount = 0;
            u.genres.forEach(g => {
                const index = this.searchByField(g.name, 'name', genreNodes);
                if (index > -1) {
                    genreNodes[index].weight += g.weight;
                    userCount++;
                }
                else if (g.weight >= default_weight || userCount < 1) {
                    genreNodes.push({
                        id: removeDots(g._id),
                        originalId: g._id,
                        name: g.name,
                        type: 'genre',
                        weight: g.weight
                    })
                    userCount++;
                };
            });
        });
        genreNodes = genreNodes.sort((a, b) => b.weight - a.weight);

        return genreNodes;
    }

    setUserNodes(users) {
        return users.map(u => Object({
            id: removeDots(u._id),
            originalId: u._id,
            image: u.image.url,
            type: 'user',
            name: u.display_name,
            user: u
        }));
    }

    setLinkNodes(links, nodes) {
        let linkNodes = [];
        links.forEach(link => {
            const source = this.searchByField(link.source, "id", nodes);
            const target = this.searchByField(link.target, "id", nodes);
            linkNodes.push({
                source: nodes[source],
                target: nodes[target],
                type: 'link_node'
            });
        });

        return linkNodes;
    }

    setLinks(users, genreNodes, default_weight) {
        const links = [];
        users.forEach(u => {
            let userCount = 0;
            u.genres.forEach(g => {
                if (g.weight >= default_weight || userCount < 1) {
                    const index = this.searchByField(g.name, 'name', genreNodes);
                    const id = (index > -1) ? genreNodes[index].id : g._id;
                    links.push({
                        source: removeDots(u._id),
                        target: removeDots(id),
                        weight: g.weight,
                        name: g.name
                    });

                    userCount++;
                }
            });
        });

        return links;
    }
}

export default new GraphHelper();