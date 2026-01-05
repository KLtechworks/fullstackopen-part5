// 5.17: Blog List End To End Testing, step 1
const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
//   beforeEach(async ({ page }) => {
//     await page.goto('http://localhost:5173')   
//   })

  // 5.18: Blog List End To End Testing, step 2
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset');
    await request.post('http://localhost:3003/api/users', {
      data: {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'ilikecats'
      }
    });
    await page.goto('http://localhost:5173');
  });
  
  // 5.17: Blog List End To End Testing, step 1   
  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByRole('textbox').first()).toBeVisible()  
    await expect(page.getByRole('textbox').nth(1)).toBeVisible()  
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('textbox').first().fill('mluukkai');
      await page.getByRole('textbox').nth(1).fill('ilikecats');
      await page.getByRole('button', { name: 'login' }).click();

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible({ timeout: 8000 });            
    });

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('textbox').first().fill('mluukkai');
      await page.getByRole('textbox').nth(1).fill('wrongpassword');
      await page.getByRole('button', { name: 'login' }).click();

      await expect(page.getByText('wrong username or password')).toBeVisible();
    
    });
  });

  // 5.19: Blog List End To End Testing, step 3
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('textbox').first().fill('mluukkai');
      await page.getByRole('textbox').nth(1).fill('ilikecats');
      await page.getByRole('button', { name: 'login' }).click();
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible({ timeout: 10000 });
      
    });

    test('a new blog can be created', async ({ page }) => {      
      await page.getByRole('button', { name: 'create new blog' }).click();      
      await page.getByLabel('title:' ).fill('Test Blog Title');
      await page.getByLabel('author:' ).fill('Test Author');
      await page.getByLabel('url:' ).fill('http://testblog.com');

      await page.getByRole('button', { name: 'create' }).click();
           
      await expect(page.getByText('a new blog Test Blog Title by Test Author added')).toBeVisible({ timeout: 10000 });
    });

    // 5.22: Blog List End To End Testing, step 6
    test('only the user who created the blog can see the delete button', async ({ page, request }) => {
      await page.getByRole('button', { name: 'create new blog' }).click();
      await page.getByLabel('title:').fill('Blog by mluukkai');
      await page.getByLabel('author:').fill('Mluukkai Author');
      await page.getByLabel('url:').fill('http://mluukkai.com');
      await page.getByRole('button', { name: 'create' }).click();
      
      await expect(page.getByText('a new blog Blog by mluukkai by Mluukkai Author added')).toBeVisible({ timeout: 10000 });
      
      await page.reload();
      await expect(page.getByRole('button', { name: 'view' })).toBeVisible({ timeout: 5000 });

      await page.getByRole('button', { name: 'view' }).click();
      await expect(page.getByRole('button', { name: 'remove' })).toBeVisible();
      
      await page.getByRole('button', { name: 'logout' }).click();
      
      await request.post('http://localhost:3003/api/users', {
        data: {
          username: 'otheruser',
          name: 'Other User',
          password: 'otherpassword'
        }
      });
      
      await page.getByRole('textbox').first().fill('otheruser');
      await page.getByRole('textbox').nth(1).fill('otherpassword');
      await page.getByRole('button', { name: 'login' }).click();
      await expect(page.getByText('Other User logged in')).toBeVisible({ timeout: 8000 });
      
      await page.getByRole('button', { name: 'view' }).click();
      
      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible();
    });

    // 5.23: Blog List End To End Testing, step 7
    test('blogs are ordered by likes (most likes first)', async ({ page }) => {
      const createBlog = async (title, author, url) => {
        await page.getByRole('button', { name: 'create new blog' }).click();
        await page.getByLabel('title:').fill(title);
        await page.getByLabel('author:').fill(author);
        await page.getByLabel('url:').fill(url);
        await page.getByRole('button', { name: 'create' }).click();
        await expect(page.getByText(`a new blog ${title} by ${author} added`)).toBeVisible({ timeout: 10000 });
      };

      const likeBlog = async (title) => {
        const blogElement = page.locator('.blogBasicInfo').filter({ hasText: title }).locator('..');
        await blogElement.getByRole('button', { name: 'view' }).click();
        await blogElement.getByRole('button', { name: 'like' }).click();
        
        await page.waitForTimeout(500);
        await blogElement.getByRole('button', { name: 'hide' }).click();
      };


      await createBlog('Blog One', 'Author 1', 'http://one.com');
      await createBlog('Blog Two', 'Author 2', 'http://two.com');
      await createBlog('Blog Three', 'Author 3', 'http://three.com');

      await page.reload();

      await likeBlog('Blog Three');
      await likeBlog('Blog Three');
      await likeBlog('Blog Three');

      await likeBlog('Blog One');
      await likeBlog('Blog One');


      const blogElements = await page.locator('.blogBasicInfo').all();
      
      const firstBlogText = await blogElements[0].textContent();
      const secondBlogText = await blogElements[1].textContent();
      const thirdBlogText = await blogElements[2].textContent();

      expect(firstBlogText).toContain('Blog Three');  
      expect(secondBlogText).toContain('Blog One');   
      expect(thirdBlogText).toContain('Blog Two');   
    });

    // 5.20: Blog List End To End Testing, step 4
    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {                      
        await page.getByRole('button', { name: 'create new blog' }).click();
        await page.getByLabel('title:').fill('Like Test Blog');
        await page.getByLabel('author:').fill('Like Tester');
        await page.getByLabel('url:').fill('http://like.com');
        await page.getByRole('button', { name: 'create' }).click();
       
        await expect(page.getByText('a new blog Like Test Blog by Like Tester added')).toBeVisible({ timeout: 10000 });
    
        await page.reload();
        await expect(page.getByRole('button', { name: 'view' })).toBeVisible({ timeout: 5000 });
        
      });

      test('a blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click();
        await expect(page.getByText('likes 0')).toBeVisible();
        await page.getByRole('button', { name: 'like' }).click();
        await expect(page.getByText('likes 1')).toBeVisible({ timeout: 10000 });
      });

      // 5.21: Blog List End To End Testing, step 5
      test('a blog can be deleted by the user who created it', async ({ page }) => {
        page.on('dialog', async dialog => {
          await dialog.accept();
        });

        await page.getByRole('button', { name: 'view' }).click();
        await page.getByRole('button', { name: 'remove' }).click();
        
        await expect(page.getByRole('button', { name: 'view' })).not.toBeVisible({ timeout: 5000 });
      });

    });

  });

})