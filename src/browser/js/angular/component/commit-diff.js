global.gitlist.ng.component('p3xGitlistCommitDiff', {
    template: require('./commit-diff.html'),
    bindings: {
        loopIndex: '@',
    },
    controller: function ($scope, $timeout) {
        const $ctrl = this;

        $scope.diff = undefined;

        $scope.showNumber = (lineInfo) => {
            const first = lineInfo.line[0];
            return first === ' ' || first === '@' || first === '-' || first === '+';
        }

        let lines;
        let index = 0;
        const generateDiff = (diff) => {
            $scope.$apply(() => {
                if (diff.lines.length > 256) {
                    lines = diff.lines;
                    diff.lines = [];
                    $scope.diff = diff;

                    const addLine = () => {
                        $timeout(() => {
                            $scope.diff.lines.push(lines[index])
                            index++
                            if (index < lines.length - 1) {
                                addLine();
                            }
                        })
                    }
                    addLine()
                } else {
                    $scope.diff = diff;
                }

            });
        }

        this.$onInit = () => {
            window.gitlist.generateDiff[this.loopIndex] = generateDiff;
        }
    },
})
