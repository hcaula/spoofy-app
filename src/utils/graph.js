const searchByField = function (value, param, array) {
    let index = -1;
    array.forEach((el, i) => {
        if (el[param] === value) {
            index = i;
            return;
        }
    });
    return index;
}

class GraphHelper {

    setGenreNodes(users, default_weight) {
        let genreNodes = [];
        users.forEach(u => {
            u.genres.forEach(g => {
                const index = searchByField(g.name, 'name', genreNodes);
                if (index > -1) genreNodes[index].weight += g.weight;
                else if (g.weight > default_weight) genreNodes.push({
                    id: g._id,
                    name: g.name,
                    type: 'genre',
                    weight: g.weight
                });
            });
        });
        genreNodes = genreNodes.sort((a, b) => b.weight - a.weight);

        return genreNodes;
    }

    setUserNodes(users) {
        return users.map(u => Object({
            id: u._id,
            image: u.image.url,
            type: 'user',
            name: u.display_name
        }));
    }

    setLinkNodes(links, nodes) {
        let linkNodes = [];
        links.forEach(link => {
            const source = searchByField(link.source, "id", nodes);
            const target = searchByField(link.target, "id", nodes);
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
            u.genres.forEach(g => {
                if (g.weight > default_weight) {
                    const index = searchByField(g.name, 'name', genreNodes);
                    const id = (index > -1) ? genreNodes[index].id : g._id;
                    links.push({
                        source: u._id,
                        target: id,
                        weight: g.weight,
                        name: g.name
                    });
                }
            });
        });

        return links;
    }
}

export default new GraphHelper();