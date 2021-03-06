(function() {

    // Modelの定義
    var Task = Backbone.Model.extend({
        defalts: {
            title: 'do something',
            completed: false
        },
        validate: function(attrs) {
            if (_.isEmpty(attrs.title)) {
                return 'タスクが入力されていません。タスクを入力してください！';
            }
        },
        initialize: function() {
            this.on('invalid', function(model, error) {
                $('#error').html(error);
            })
        }
    });

    // Collectionの定義
    var Tasks = Backbone.Collection.extend({model: Task});

    var TaskView = Backbone.View.extend({
        tagName: 'li',
        initialize: function() {
            this.model.on('destroy', this.remove, this);
            this.model.on('change', this.render, this);
        },
        events: {
            'click .delete': 'destroy',
            'click .toggle': 'toggle'
        },
        toggle: function() {
            this.model.set('completed', !this.model.get('completed'));
        },
        destroy: function() {
            if (confirm('are you sure?')) {
               this.model.destroy(); 
            }
        },
        remove: function() {
            this.$el.remove();
        },
        template: _.template($('#task-template').html()),
        render: function() {
            var template = this.template(this.model.toJSON());
            this.$el.html(template);
            return this;
        }
    });

    // Viewの定義
    var TasksView = Backbone.View.extend({
        tagName: 'ul',
        initialize: function() {
            this.collection.on('add', this.addNew, this);
            this.collection.on('change', this.updateCount, this);
            this.collection.on('destroy', this.updateCount, this);
        },
        addNew: function(task) {
            var taskView = new TaskView({model: task});
            this.$el.append(taskView.render().el);
            $('#title').val('').focus();
            this.updateCount();
        },
        updateCount: function() {
            var uncompletedTasks = this.collection.filter(function(task){
                return !task.get('completed');
            });
            $('#count').html(uncompletedTasks.length);
        },
        render: function() {
            this.collection.each(function(task) {
                var taskView = new TaskView({model: task});
                this.$el.append(taskView.render().el);
            }, this);
            this.updateCount();
            return this;
        }
    });

    // FormのViewの定義
    var AddTaskView = Backbone.View.extend({
        el: '#addTask',
        events: {
            'submit': 'submit'
        },
        submit: function(e) {
            e.preventDefault();
            var task = new Task();
            if (task.set({title: $('#title').val(), completed:false}, {validate: true})) {
                this.collection.add(task);
                $('#error').empty();
            }
        }
    });

    // Collectionを格納
    var tasks = new Tasks([
        {
            title: 'タスク管理開発',
            completed: true
        },
        {
            title: '勤務表作成',
            completed: false
            
        },
        {
            title: 'レンタカー予約',
            completed: false
        }
    ]);

    // インスタンス生成
    var tasksView = new TasksView({collection: tasks});
    var addTaskView = new　AddTaskView({collection: tasks});

    $('#tasks').html(tasksView.render().el);

})();