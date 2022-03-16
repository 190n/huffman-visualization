const std = @import("std");
const Allocator = std.mem.Allocator;
const Node = @import("./node.zig").Node;

pub fn PriorityQueue(comptime T: type, comptime cmp: fn (T, T) std.math.Order) type {
    return struct {
        capacity: usize,
        tail: usize,
        items: []T,
        allocator: Allocator,

        const Self = @This();

        pub fn init(allocator: Allocator, capacity: usize) !*Self {
            var q: *Self = try allocator.create(Self);
            errdefer allocator.destroy(q);
            q.* = .{
                .capacity = capacity,
                .tail = 0,
                .allocator = allocator,
                .items = try allocator.alloc(T, capacity),
            };
            return q;
        }

        pub fn deinit(self: *Self) void {
            self.allocator.free(self.items);
            self.allocator.destroy(self);
        }

        pub fn empty(self: *const Self) bool {
            return self.tail == 0;
        }

        pub fn full(self: *const Self) bool {
            return self.tail == self.capacity;
        }

        pub fn size(self: *const Self) usize {
            return self.tail;
        }

        fn minChild(self: *const Self, first: usize, last: usize) usize {
            const left = 2 * first;
            const right = left + 1;
            if (right <= last and cmp(self.items[right - 1], self.items[left - 1]) == .lt) {
                return right;
            } else {
                return left;
            }
        }

        fn fixHeap(self: *Self, first: usize, last: usize) void {
            var found = false;
            var parent = first;
            var great = self.minChild(parent, last);

            while (parent <= last / 2 and !found) {
                if (cmp(self.items[parent - 1], self.items[great - 1]) == .gt) {
                    std.mem.swap(T, &self.items[parent - 1], &self.items[great - 1]);
                    parent = great;
                    great = self.minChild(parent, last);
                } else {
                    found = true;
                }
            }
        }

        pub fn enqueue(self: *Self, x: T) error{Full}!void {
            if (self.full()) {
                return error.Full;
            } else {
                // insert node at the end
                var current_index = self.tail + 1;
                self.tail += 1;
                self.items[current_index - 1] = x;
                // bubble up
                while (current_index > 1 and cmp(self.items[current_index - 1], self.items[current_index / 2 - 1]) == .lt) {
                    std.mem.swap(T, &self.items[current_index - 1], &self.items[current_index / 2 - 1]);
                    current_index /= 2;
                }
            }
        }

        pub fn dequeue(self: *Self) ?T {
            if (self.empty()) {
                return null;
            } else {
                // get root node
                const item = self.items[0];
                // move last node to front
                self.tail -= 1;
                self.items[0] = self.items[self.tail];
                // push it down
                self.fixHeap(1, self.tail);
                // return it
                return item;
            }
        }
    };
}

// test PriorityQueue with numbers
fn i32Compare(a: i32, b: i32) std.math.Order {
    if (a < b) {
        return .lt;
    } else if (a > b) {
        return .gt;
    } else {
        return .eq;
    }
}

const expect = std.testing.expect;
const expectEqual = std.testing.expectEqual;
const expectError = std.testing.expectError;

test "PriorityQueue.init" {
    var pq = try PriorityQueue(i32, i32Compare).init(std.testing.allocator, 10);
    defer pq.deinit();
    try expectEqual(@as(usize, 10), pq.capacity);
    try expectEqual(@as(usize, 0), pq.size());
    try expect(pq.empty());
    try expect(!pq.full());
}

test "PriorityQueue operations" {
    var pq = try PriorityQueue(i32, i32Compare).init(std.testing.allocator, 10);
    defer pq.deinit();

    const nums = [_]i32{5, 3, 6, 7, 10, 8};
    var sorted = nums;
    std.sort.sort(i32, &sorted, {}, comptime std.sort.asc(i32));

    for (nums) |n| {
        try pq.enqueue(n);
    }

    try expectEqual(nums.len, pq.size());

    for (sorted) |n| {
        try expectEqual(n, pq.dequeue().?);
    }

    try expect(pq.empty());
}


test "full and empty PriorityQueue" {
    var pq = try PriorityQueue(i32, i32Compare).init(std.testing.allocator, 10);
    defer pq.deinit();

    var i: i32 = 0;
    while (i < pq.capacity) : (i += 1) {
        try pq.enqueue(i);
    }

    try expect(pq.full());
    try expectError(error.Full, pq.enqueue(50));

    while (!pq.empty()) {
        _ = pq.dequeue();
    }

    try expectEqual(@as(?i32, null), pq.dequeue());
}
