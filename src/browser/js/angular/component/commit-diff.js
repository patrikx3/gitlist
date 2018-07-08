global.gitlist.ng.component('p3xGitlistCommitDiff', {
    template: require('./commit-diff.html'),
    bindings: {
        filename: '@',
        loopIndex: '@',
    },
    controller: function ($scope, $timeout, $http) {
        const $ctrl = this;


        $scope.diff = undefined;
        $scope.done = false;

        $scope.showNumber = (lineInfo) => {
            const first = lineInfo.line[0];
            return first === ' ' || first === '@' || first === '-' || first === '+';
        }

        let lines;
        let index = 0;
        let diff;
        const maxSizeLine = 256;
        let show = true;
        let originalSizeLine;
       // let scrollerDiv

        const addLine = () => {
            /*
             $timeout(() => {
                for(let i = 0; i < maxSizeLine; i++) {
                    //console.log(i);
                    if (index < lines.length - 1) {
                        $scope.diff.lines.push(lines[index])
                        index++
                    } else {
                        break;
                    }
                }

                 if (index < lines.length - 1) {
                    addLine();
                } else {
                    $scope.done = true;
                }
            })
            */
            $timeout(() => {
                $scope.diff.lines.push(lines[index])
                index++
                if (index < lines.length) {
                    if (show) {
                        addLine();
                    }
                }else {
                    $scope.done = true
                }

               // scrollerDiv.scrollTop = scrollerDiv.scrollHeight;
            })
        }

        const generateDiff = async (options) => {

            const {loading, toggle} = options;

            if (toggle) {
                show = !show;
                if (show && originalSizeLine > maxSizeLine && index < lines.length) {
                    addLine();
                }
                ;
            }

            if (!loading) {
                return;
            }



            try {
                const url = new URL(location)
                url.searchParams.append('ajax', '1')
                url.searchParams.append('filename', this.filename)
                const response = await $http.get(url.toString());
                if (typeof(response.data) === 'string') {
                    throw new Error(response.data)
                }
                //console.log(response.data);
                diff = response.data[0];

                $scope.$apply(() => {
                    originalSizeLine = diff.lines.length
                    if (originalSizeLine > maxSizeLine) {
//                        console.log('original', diff.lines.length)
                        $scope.diffLength = diff.lines.length
                        lines = diff.lines.splice(maxSizeLine);
                    //    scrollerDiv = document.getElementById(`p3x-gitlist-commit-diff-scroller-${ $ctrl.loopIndex }`)
                        $scope.diff = diff;
//                        console.log('first allowed', diff.lines.length)
//                        console.log('left', lines.length)
//                        console.log(lines.length + diff.lines.length, 'result total' )
                        addLine()
                    } else {
                        $scope.diff = diff;
                        $scope.done = true;
                    }
                });

            } catch (e) {
                window.gitlist.ajaxErrorHandler(e)
            }
        }

        this.$onInit = () => {
            window.gitlist.generateDiff[this.loopIndex] = generateDiff;
        }
    },
})
