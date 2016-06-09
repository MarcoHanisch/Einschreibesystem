<?php
/**
 * Created by IntelliJ IDEA.
 * User: Marco Hanisch
 * Authors: Marco Hanisch
 * Date: 09.06.2016
 * Time: 11:13
 */
namespace Core\APIBundle\Controller\Admin;
use Core\EntityBundle\Entity\Invitation;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\Routing\ClassResourceInterface;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\View\View;
use FOS\RestBundle\Util\Codes;
use Core\EntityBundle\Entity\User;
/**
 * Class RestController.
 */
 
 class AdminController extends FOSRestController implements ClassResourceInterface
 {/**
      * @ApiDoc(
      *  resource=true,
      *  description="Action to reset the password",
      *  output = "Core\EntityBundle\Entity\Admin",
      *  statusCodes = {
      *      200 = "Returned when successful",
      *      404 = "Returned when the data is not found"
      *  },requirements={
      *        "name"="email",
      *        "dataType"="string",
      *        "requirement"=".*",
      *        "description"="email of the admin"
      * }
      * )
      * @param  $token string
      * @param  $password string
      * @return \Symfony\Component\HttpFoundation\Response
      * @Rest\View()
      */
     public function PostResetPasswordAction($token, $password)
     {
         $UserManager = $this->get('fos_user.user_manager');
         $admin = $UserManager->findUserByConfirmationToken($token);
         if(!$admin){
             throw $this->createNotFoundException("Admin not found");
         } else {
             $admin->setPlainPassword($password);
         }
         $this->getDoctrine()->getManager()->persist($admin);
         $this->getDoctrine()->getManager()->flush();
     }
 
 
 }
