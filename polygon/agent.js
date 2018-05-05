var AgentManager = function() {
    this.agentCount = 0;
    this.agentSize = 10;

    this.maxSpeed = 10;
    this.distanceBetweenAgents = 50;
    this.structure = 0;
    this.stopFlag = false;

    this.laplacian = [];

    this.position_x = [];
    this.position_y = [];
    this.velocity_x = [];
    this.velocity_y = [];
    this.distances_x = [];
    this.distances_y = [];

    this.initialize = () => {
        for (let i = 0; i < 3; i ++) {
            AgentManager.createAgent(random(canvas.width/2), random(canvas.height/2));
        }
    };

    this.createAgent = (x, y) => {
        createSprite(x, y, this.agentSize, this.agentSize);
        this.agentCount += 1;
        this.calculateScene();
    };

    this.createMultipleAgents = (numOfAgents) => {
        for (i = 0; i < numOfAgents; i++) {
            let x = random(canvas.width);
            let y = random(canvas.height);
            createSprite(x, y, this.agentSize, this.agentSize);
        }
        this.agentCount = numOfAgents;
        this.calculateScene();
    };

    this.showAgents = () => {
        this.updateLocations();
        this.calculateVelocities();
        this.updateVelocities();
        drawSprites();
        if (this.showLinesBetweenAgents == true) {
            this.showLines();
        }
    };

    this.updateLocations = () => {
        this.position_x = [];
        this.position_y = [];
        for (i = 0; i < allSprites.length; i++) {
            s = allSprites[i];
            this.position_x.push([s.position.x]);
            this.position_y.push([s.position.y]);
        }
    };

    this.calculateVelocities = () => {
        d_x = numeric.dot(this.laplacian, this.position_x);
        d_y = numeric.dot(this.laplacian, this.position_y);
        distances_x = numeric.dot(this.laplacian, this.distances_x);
        distances_y = numeric.dot(this.laplacian, this.distances_y);
        this.velocity_x = numeric.add(d_x, distances_x);;
        this.velocity_y = numeric.add(d_y, distances_y);;
    };

    this.updateVelocities = () => {
        for (i = 0; i < allSprites.length; i++) {
            s = allSprites[i];
            s.setVelocity(this.velocity_x[i][0] / 20, this.velocity_y[i][0] / 20);
            if (!this.stopFlag) {
                s.limitSpeed(this.maxSpeed);
            } else {
                s.limitSpeed(0);
            }
        }
    };

    this.calculateScene = () => {
        let distance = this.distanceBetweenAgents;
        this.distances_x = findDistances(this.agentCount, distance, 'x');
        this.distances_y = findDistances(this.agentCount, distance, 'y');
        adjacency = makeAdjacencyMatrix(this.agentCount, this.structure);
        this.laplacian = makeLaplacianMatrix(adjacency);
    };

    this.showLines = () => {
        for (i = 0; i < allSprites.length; i++) {
            s1 = allSprites[i];
            if (i != allSprites.length - 1) {
                s2 = allSprites[i + 1];
                line(s1.position.x, s1.position.y, s2.position.x, s2.position.y);
            } else {
                line(s1.position.x, s1.position.y, allSprites[0].position.x, allSprites[0].position.y);
            }
        }
    };

    this.startScene = () => {
        this.stopFlag = false;
    };

    this.stopScene = () => {
        this.stopFlag = true;
    };

    this.randomize = () => {
        for (i = 0; i < allSprites.length; i++) {
            allSprites[i].position.x = random(canvas.width/2);
            allSprites[i].position.y = random(canvas.height/2);
        }
    };

    this.resetAgents = (numOfAgents) => {
        allSprites.clear();
        this.createMultipleAgents(numOfAgents);
    };

    this.updateMaxSpeed = (newMaxSpeed) => {
        this.maxSpeed = newMaxSpeed;
    };

    this.updateDistanceBetweenAgents = (newDistance) => {
        this.distanceBetweenAgents = newDistance;
        this.calculateScene();
    };

    this.updateStructure = (newStructure) => {
        this.structure = newStructure;
    };

    this.setLeaderPosition = (x, y) => {
        allSprites[0].position.x = x;
        allSprites[0].position.y = y;
    };

};
