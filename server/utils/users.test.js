const expect = require('expect');
const {Users} = require('./users');

describe('Users', () => {
    beforeEach(() => {
        users = new Users();
        users.users = [
            {
                id : '1',
                name : 'Mike',
                room : 'Node Course'
            },
            {
                id : '2',
                name : 'Jen',
                room : 'React Course'
            },
            {
                id : '3',
                name : 'Julie',
                room : 'Node Course'
            }
        ];
    });

    it('should add new user', () => {
        var users = new Users();
        var user = {
            id : '123',
            name : 'Andrew',
            room : 'The office fan'
        };
        var responseUser = users.addUser(user.id, user.name, user.room);
        expect(users.users).toEqual([user]);
    });

    it('should find user', () => {
        var userId = '1';
        var user = users.getUser('1');
        expect(user.id).toBe(userId);
    });

    it('should not find user', () => {
        var userId = '4';
        var user = users.getUser(userId);
        expect(user).toNotExist();
    });

    it('should remove a user', () => {
        var userId = '1';
        var user = users.removeUser(userId);
        expect(user.id).toBe(userId);
        expect(users.users.length).toBe(2);
    });

    it('should not remove user', () => {
        var userId = '4';
        var user = users.removeUser(userId);
        expect(user).toNotExist();
        expect(users.users.length).toBe(3);
    });

    it('should return names for node course', () => {
        var userList = users.getUserList('Node Course');
        expect(userList).toEqual(['Mike', 'Julie']);
    });

    it('should return names for react course', () => {
        var userList = users.getUserList('React Course');
        expect(userList).toEqual(['Jen']);
    });

    it('should return true when user has registered on room', () => {
        var registered = users.isRegistered('Jen', 'React Course');
        expect(registered).toBe(true);
    });

    it('should return false when user has not registered on room', () => {
        var registered = users.isRegistered('Jen', 'Node Course');
        expect(registered).toBe(false);
    });

    it('should return false when user not registered', () => {
        var registered = users.isRegistered('Markus', 'React Course');
        expect(registered).toBe(false);
    });
});