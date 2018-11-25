class CloudHandler {
    constructor(game, grid, cloudData) {
        this.game = game;
        this.grid = grid;
        this.cloudData = cloudData;

        const fill = new Osmium.CTXElement.Fill(this.cloudData.revert, true);
        const stroke = new Osmium.CTXElement.Stroke();
        stroke.match(fill);

        if (this.cloudData.path == null) {
            this.batchRenderer = new Osmium.BatchRenderer((element) => {
                for (const child of element.elements) {
                    child.fill.open = false; child.fill.close = true;
                    child.stroke.open = false; child.stroke.close = true;
                }

                return false;
            }, (ctx) => {
                fill.apply(ctx);
                stroke.apply(ctx);
            });

            this.game.add(this.batchRenderer);
        }
    }

    genSize() {
        return parseInt(Math.random() * 5) + 2;
    }

    genPosition(x, y) {
        return new Osmium.Vector(
            x == null? parseInt(Math.random() * this.grid.width) * blockSize : x,
            y == null? parseInt((Math.random() * this.grid.height * 0.1) + 3) * blockSize : y
        );
    }

    createVisuals(position, size, blockSize) {
        const cloudsElement = new Osmium.CTXElement.Group();
        cloudsElement.position = position;
        cloudsElement.width = size * blockSize;

        const width = blockSize * window.devicePixelRatio;

        for (let x = 0; x < size; x++) {
            let block = null;

            if (this.cloudData.path != null) {
                block = new Osmium.CTXElement.Image(
                    new Osmium.Image(this.cloudData.path),
                    null, null,
                    new Osmium.Vector(width, width)
                );
            } else {
                block = new Osmium.CTXElement.Simple.Rectangle(width, width);

                block.fill.color = this.cloudData.revert.randomise(30);
                block.stroke.color = block.fill.color;
                block.stroke.enabled = true;
            }

            block.position.set(blockSize * x, 0);
            cloudsElement.add(block);
        }

        return cloudsElement;
    }

    genCloud(givenX, blockSize) {
        const cloudsElement = this.createVisuals(this.genPosition(givenX, null), this.genSize(), blockSize);

        cloudsElement.addAnimation(
            new Osmium.Animation.RestartAnimation(
                'position.x',
                (((Math.random() * 20) + 5) / 250),
                -cloudsElement.width,
                (x) => x > this.game.width
            )
        );

        if (this.cloudData.path == null) this.batchRenderer.add(cloudsElement);
        else this.game.add(cloudsElement);
    }

    genClouds(no, blockSize) {
        for (let i = 0; i < no; i++) {
            this.genCloud(null, blockSize);
        }
    }
}